const mongoose = require('mongoose') /* .set('debug', true) */
const store = require('store')
const {
  getPagedItems,
  confirmMember,
  isAdminCheck,
  asyncForEach
} = require('../handlers/tools')

const Group = mongoose.model('Group')
const Event = mongoose.model('Event')
const User = mongoose.model('User')

const returnNextUpdatedOptions = {
  new: true, // return the new group instead of the old one
  runValidators: true
}

exports.isAdmin = async (req, res, next) =>
  isAdminCheck(req, res, next, Group, 'group')

exports.addPage = (req, res) => {
  res.render('editGroup', {
    title: "Création d'un Groupe",
    csrfToken: req.csrfToken()
  })
}

exports.editGroupPage = async (req, res) => {
  const group = await Group.findOne({ _id: req.paramString('id') })

  res.render('editGroup', {
    group,
    title: 'Edition du Groupe',
    csrfToken: req.csrfToken()
  })
}

exports.create = async (req, res) => {
  store.set('editgroups-form-data', req.body) // store body to prefill the register form
  req.sanitizeBody('name')
  req.sanitizeBody('description')
  req.checkBody('name', 'Vous devez saisir le nom du groupe').notEmpty()
  req.checkBody('description', 'Veuillez saisir une description.').notEmpty()
  const errors = req.validationErrors()
  if (errors) {
    store.set('form-errors', errors.map(err => err.param))
    req.flash('error', errors.map(err => err.msg))
    return res.redirect('/group/add')
  }
  // save the author
  req.body.author = req.user._id
  // add the author as admin into the community
  req.body.community = [{ user: req.user._id, role: 'admin' }]

  // TODO: Check the number of groups already created to limit the process

  // Create the new group
  const group = await new Group(req.body).save()
  req.flash('success', `Groupe "${group.name}" créé avec succès !`)
  res.redirect(`/group/${group.slug}`)
}

exports.updateGroup = async (req, res) => {
  store.set('editgroups-form-data', req.body) // store body to prefill the register form
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

  const group = await Group.findOneAndUpdate(
    { _id: req.paramString('id') },
    req.body,
    returnNextUpdatedOptions
  ).exec()
  req.flash(
    'success',
    `Groupe <strong>${group.name}</strong> mis à jour. <a href="/group/${
      group.slug
    }">Voir</a>`
  )
  res.redirect(`/group/${group.slug}`)
}

exports.remove = async (req, res, next) => {
  const group = await Group.findOne({ _id: req.paramString('id') }).populate(
    'author'
  )
  if (!group) return next()

  group.status = 'archived'
  const groupResult = await group.save()
  if (!groupResult) return next()

  // Remove the linked events
  const events = await Event.find({
    group: group._id,
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

exports.getGroupBySlug = async (req, res, next) => {
  const group = await Group.findOne({ slug: req.paramString('slug') })
  if (!group) return next()

  const isAdmin = confirmMember(req.user, group, 'admin')

  let remove = false
  if (req.queryString('remove')) remove = true

  // we can't see an group if it's not published and we don't own it
  //   or we can't remove the group if not admin
  if ((group.status !== 'published' || remove) && !isAdmin) {
    req.flash('error', 'Vous ne pouvez pas effectuer cet action !')
    return res.redirect(`/group/${group.slug}`)
  }

  const inCommunity = confirmMember(req.user, group)
  const isMember = confirmMember(req.user, group, 'member')
  const isPendingMember = confirmMember(req.user, group, 'pending_request')
  const isDenied = confirmMember(req.user, group, 'denied')

  const community = []

  // Get user object for each community member
  await asyncForEach(group.community, async member => {
    const found = await User.findById(member.user)
    if (found) {
      found.role = member.role
      community.push(found)
    }
  })

  group.community = [] // Remove old community data

  res.render('group', {
    title: group.name,
    csrfToken: req.csrfToken(),
    group,
    community,
    inCommunity,
    isAdmin,
    isMember,
    isPendingMember,
    isDenied,
    remove
  })
}

exports.getGroups = async (req, res) => {
  const page = req.queryInt('page') || 1
  const limit = req.queryInt('limit') || 7
  const find = {
    $or: [{ author: req.user._id }, { 'community.user': req.user._id }],
    status: { $regex: '^((?!archived).)*$', $options: 'i' }
  }
  const result = await getPagedItems(
    Group,
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
  return Group.findOneAndUpdate(
    { _id: req.paramString('id') },
    pendingRequestUpdate(action, req.user._id, role),
    returnNextUpdatedOptions
  ).exec()
}

/**  Demande d'adhésion */
exports.addPendingRequest = async (req, res) => {
  const group = await pendingRequestUpdateMember(
    req,
    '$push',
    'pending_request'
  )
  req.flash('success', "Demande d'adhésion envoyée avec succès !")
  res.redirect(`/group/${group.slug}`)
}

/** Retirer demande d'adhésion */
exports.removePendingRequest = async (req, res) => {
  const group = await pendingRequestUpdateMember(
    req,
    '$pull',
    'pending_request'
  )
  req.flash('success', "Votre demande d'adhésion a été annulée !")
  res.redirect(`/group/${group.slug}`)
}
/** Quit the group */
exports.quitRequest = async (req, res) => {
  await pendingRequestUpdateMember(req, '$pull')
  req.flash('success', 'Vous avez quitter le groupe')
  res.redirect(`/account`)
}

/*  Admin */

exports.hasMoreThanOneAdmins = async (req, res, next) => {
  const group = await Group.findOne({ _id: req.paramString('id') })
  const count = group.community.reduce((n, o) => n + (o.role === 'admin'), 0)
  // We are not admin OR there are more than 1 admin
  if (!confirmMember(req.user, group, 'admin') || count > 1) {
    next() // carry on, there is at least another commander !
    return
  }
  req.flash('info', 'Vous êtes le seul admin ! Voulez-vous archiver ce group ?')
  res.redirect(`/group/${group.slug}?remove=true`)
}

const pendingRequestUpdateAdmin = async (req, roleIn, newRole) => {
  return Group.findOneAndUpdate(
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
  const group = await pendingRequestUpdateAdmin(
    req,
    ['pending_request'],
    'member'
  )
  req.flash('success', 'Adhésion acceptée avec succès !')
  res.redirect(`/group/${group.slug}#community`)
}

exports.denyPendingRequest = async (req, res) => {
  const group = await pendingRequestUpdateAdmin(
    req,
    ['pending_request', 'member', 'admin'],
    'denied'
  )
  req.flash('success', 'Utilisateur bloqué avec succès !')
  res.redirect(`/group/${group.slug}#community`)
}

/** Débloquer et mettre en attente */
exports.grantPendingRequest = async (req, res) => {
  const group = await pendingRequestUpdateAdmin(
    req,
    ['denied'],
    'pending_request'
  )
  req.flash('success', 'Utilisateur débloqué avec succès !')
  res.redirect(`/group/${group.slug}#community`)
}

exports.giveAdminRightRequest = async (req, res) => {
  const group = await pendingRequestUpdateAdmin(req, ['member'], 'admin')
  req.flash('success', 'Nouvel administrateur ajouté avec succès !')
  res.redirect(`/group/${group.slug}#community`)
}

exports.removeAdminRightRequest = async (req, res, next) => {
  const group = await pendingRequestUpdateAdmin(req, ['admin'], 'member')
  req.flash('success', 'Administrateur retiré avec succès !')
  res.redirect(`/group/${group.slug}#community`)
}
