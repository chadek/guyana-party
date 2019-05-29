const mongoose = require('mongoose') /* .set('debug', true) */
const store = require('store')
const {
  getPagedItems,
  confirmMember,
  asyncForEach
} = require('../handlers/tools')

const Organism = mongoose.model('Organism')
const Event = mongoose.model('Event')
const User = mongoose.model('User')

const returnNextUpdatedOptions = {
  new: true, // return the new organism instead of the old one
  runValidators: true
}

exports.isAdmin = async (req, res, next) => {
  const orga = await Organism.findOne({ _id: req.paramString('id') })
  const isAdmin = orga && confirmMember(req.user, orga, 'admin')
  if (isAdmin) {
    next() // carry on! They are admin!
    return
  }
  req.flash('error', 'Vous ne pouvez pas effectuer cette action !')
  res.redirect(`/organism/${orga.slug}`)
}

exports.addPage = (req, res) => {
  res.render('editOrganism', {
    title: "Création d'un Groupe",
    csrfToken: req.csrfToken()
  })
}

exports.editOrgaPage = async (req, res) => {
  const orga = await Organism.findOne({ _id: req.paramString('id') })

  res.render('editOrganism', {
    orga,
    title: 'Edition du Groupe',
    csrfToken: req.csrfToken()
  })
}

exports.create = async (req, res) => {
  store.set('editorgas-form-data', req.body) // store body to prefill the register form
  req.sanitizeBody('name')
  req.sanitizeBody('description')
  req.checkBody('name', 'Vous devez saisir le nom du groupe').notEmpty()
  req.checkBody('description', 'Veuillez saisir une description.').notEmpty()
  const errors = req.validationErrors()
  if (errors) {
    store.set('form-errors', errors.map(err => err.param))
    req.flash('error', errors.map(err => err.msg))
    return res.redirect('/organisms/add')
  }
  // save the author
  req.body.author = req.user._id
  // add the author as admin into the community
  req.body.community = [{ user: req.user._id, role: 'admin' }]

  // TODO: Check the number of orgas already created to limit the process

  // Create the new organism
  const orga = await new Organism(req.body).save()
  req.flash('success', `Groupe "${orga.name}" créé avec succès !`)
  res.redirect(`/organism/${orga.slug}`)
}

exports.updateOrga = async (req, res) => {
  store.set('editorgas-form-data', req.body) // store body to prefill the register form
  req.sanitizeBody('name')
  req.sanitizeBody('description')
  req.checkBody('name', 'Vous devez saisir le nom du groupe').notEmpty()
  req.checkBody('description', 'Veuillez saisir une description.').notEmpty()
  const errors = req.validationErrors()
  if (errors) {
    store.set('form-errors', errors.map(err => err.param))
    req.flash('error', errors.map(err => err.msg))
    return res.redirect('back')
  }
  // set the updated date
  req.body.updated = new Date()

  const orga = await Organism.findOneAndUpdate(
    { _id: req.paramString('id') },
    req.body,
    returnNextUpdatedOptions
  ).exec()
  req.flash(
    'success',
    `Groupe <strong>${orga.name}</strong> mis à jour. <a href="/organism/${
      orga.slug
    }">Voir</a>`
  )
  res.redirect(`/organisms/${orga._id}/edit`)
}

exports.remove = async (req, res, next) => {
  const orga = await Organism.findOne({ _id: req.paramString('id') }).populate(
    'author'
  )
  if (!orga) return next()

  orga.status = 'archived'
  const orgaResult = await orga.save()
  if (!orgaResult) return next()

  // Remove the linked events
  const events = await Event.find({
    organism: orga._id,
    status: { $regex: '^((?!archived).)*$', $options: 'i' }
  })
  if (!events) return next()
  events.map(async event => {
    event.status = 'archived'
    await event.save()
  })

  req.flash('success', 'Votre groupe a été archivé.')
  res.redirect('/account')
}

exports.getOrgaBySlug = async (req, res, next) => {
  const orga = await Organism.findOne({ slug: req.paramString('slug') })
  if (!orga) return next()

  // we can't see an event if it's not published and we don't own it
  const isAdmin = confirmMember(req.user, orga, 'admin')
  if (orga.status !== 'published' && !isAdmin) {
    req.flash('error', 'Vous ne pouvez pas effectuer cet action !')
    return next()
  }

  const inCommunity = confirmMember(req.user, orga)
  const isMember = confirmMember(req.user, orga, 'member')
  const isPendingMember = confirmMember(req.user, orga, 'pending_request')
  const isDenied = confirmMember(req.user, orga, 'denied')

  const community = []

  // Get user object for each community member
  await asyncForEach(orga.community, async member => {
    const found = await User.findById(member.user)
    if (found) {
      found.role = member.role
      community.push(found)
    }
  })

  orga.community = [] // Remove old community data

  res.render('organism', {
    orga,
    title: orga.name,
    csrfToken: req.csrfToken(),
    remove: req.queryString('remove'),
    community,
    inCommunity,
    isMember,
    isAdmin,
    isPendingMember,
    isDenied
  })
}

exports.getOrganisms = async (req, res) => {
  const page = req.queryInt('page') || 1
  const limit = req.queryInt('limit') || 7
  const find = {
    $or: [{ author: req.user._id }, { 'community.user': req.user._id }],
    status: { $regex: '^((?!archived).)*$', $options: 'i' }
  }
  const result = await getPagedItems(
    Organism,
    page,
    limit,
    find,
    {},
    { created: 'desc' }
  )
  res.json(result)
}

/* Community */

const pendingRequestUpdate = (action, user, role) => {
  const result = {
    [action]: {
      community: { user }
    }
  }
  if (role) result[action].community.role = role
  return result
}

const pendingRequestUpdateMember = async (req, action, role) => {
  return Organism.findOneAndUpdate(
    { _id: req.paramString('id') },
    pendingRequestUpdate(action, req.user._id, role),
    returnNextUpdatedOptions
  ).exec()
}

/**  Demande d'adhésion */
exports.addPendingRequest = async (req, res) => {
  const orga = await pendingRequestUpdateMember(req, '$push', 'pending_request')
  req.flash('success', "Demande d'adhésion envoyée avec succès !")
  res.redirect(`/organism/${orga.slug}`)
}

/** Retirer demande d'adhésion */
exports.removePendingRequest = async (req, res) => {
  const orga = await pendingRequestUpdateMember(req, '$pull', 'pending_request')
  req.flash('success', "Votre demande d'adhésion a été annulée !")
  res.redirect(`/organism/${orga.slug}`)
}
/** Quit the group */
exports.quitRequest = async (req, res) => {
  await pendingRequestUpdateMember(req, '$pull')
  req.flash('success', 'Vous avez quitter le groupe')
  res.redirect(`/account`)
}

/*  Admin */

exports.hasMoreThanOneAdmins = async (req, res, next) => {
  const orga = await Organism.findOne({ _id: req.paramString('id') })
  const count = orga.community.reduce((n, o) => n + (o.role === 'admin'), 0)
  if (count > 1) {
    next() // carry on, there is at least another commander !
    return
  }
  req.flash('info', 'Vous êtes le seul admin ! Voulez-vous archiver ce group ?')
  res.redirect(`/organism/${orga.slug}?remove=true`)
}

const pendingRequestUpdateAdmin = async (req, roleIn, newRole) => {
  return Organism.findOneAndUpdate(
    {
      _id: req.paramString('id'),
      community: {
        $elemMatch: {
          user: req.paramString('userId'),
          role: { $in: roleIn }
        }
      }
    },
    {
      $set: {
        'community.$.role': newRole,
        'community.$.memberDate': Date.now()
      }
    },
    returnNextUpdatedOptions
  ).exec()
}

exports.acceptPendingRequest = async (req, res) => {
  const orga = await pendingRequestUpdateAdmin(
    req,
    ['pending_request'],
    'member'
  )
  req.flash('success', 'Adhésion acceptée avec succès !')
  res.redirect(`/organism/${orga.slug}#community`)
}

exports.denyPendingRequest = async (req, res) => {
  const orga = await pendingRequestUpdateAdmin(
    req,
    ['pending_request', 'member', 'admin'],
    'denied'
  )
  req.flash('success', 'Utilisateur bloqué avec succès !')
  res.redirect(`/organism/${orga.slug}#community`)
}

/** Débloquer et mettre en attente */
exports.grantPendingRequest = async (req, res) => {
  const orga = await pendingRequestUpdateAdmin(
    req,
    ['denied'],
    'pending_request'
  )
  req.flash('success', 'Utilisateur débloqué avec succès !')
  res.redirect(`/organism/${orga.slug}#community`)
}

exports.giveAdminRightRequest = async (req, res) => {
  const orga = await pendingRequestUpdateAdmin(req, ['member'], 'admin')
  req.flash('success', 'Nouvel administrateur ajouté avec succès !')
  res.redirect(`/organism/${orga.slug}#community`)
}

exports.removeAdminRightRequest = async (req, res, next) => {
  const orga = await pendingRequestUpdateAdmin(req, ['admin'], 'member')
  req.flash('success', 'Administrateur retiré avec succès !')
  res.redirect(`/organism/${orga.slug}#community`)
}
