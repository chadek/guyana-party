const mongoose = require('mongoose') /* .set('debug', true) */
const store = require('store')
const {
  getPagedItems,
  confirmOwner,
  asyncForEach
} = require('../handlers/tools')

const Organism = mongoose.model('Organism')
const Event = mongoose.model('Event')
const User = mongoose.model('User')

exports.addPage = (req, res) => {
  res.render('editOrganism', {
    title: "Création d'un Groupe",
    csrfToken: req.csrfToken()
  })
}

exports.editOrgaPage = async (req, res) => {
  // 1. Find the organism given the ID
  const orga = await Organism.findOne({ _id: req.paramString('id') })
  // 2. confirm they are the owner of the organism
  confirmOwner(orga, req.user)
  // 3. render out the edit form so the user can update their organism
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
    {
      new: true, // return the new organism instead of the old one
      runValidators: true
    }
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
  confirmOwner(orga, req.user) // we can't remove a groupe if we don't own it

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

  req.flash('success', `Votre groupe a été archivé.`)
  res.redirect('/account')
}

const confirmMember = (user, community, role) => {
  if (!user || !community) return false
  if (role) {
    return (
      undefined !==
      community.find(o => o._id.equals(user._id) && o.role === role)
    )
  } else return undefined !== community.find(o => o._id.equals(user._id))
}

exports.getOrgaBySlug = async (req, res, next) => {
  const orga = await Organism.findOne({ slug: req.paramString('slug') })

  if (!orga) return next()
  if (orga.status !== 'published') confirmOwner(orga, req.user) // we can't see an event if it's not published and we don't own it

  const community = []

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
    inCommunity: confirmMember(req.user, community),
    isMember: confirmMember(req.user, community, 'member'),
    isAdmin: confirmMember(req.user, community, 'admin'),
    isPendingMember: confirmMember(req.user, community, 'pending_request'),
    isDenied: confirmMember(req.user, community, 'denied')
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

exports.addPendingRequest = async (req, res) => {
  const orga = await Organism.findOneAndUpdate(
    { _id: req.paramString('groupId') },
    {
      $push: {
        community: {
          user: req.user._id,
          role: 'pending_request'
        }
      }
    },
    {
      new: true, // return the new organism instead of the old one
      runValidators: true
    }
  ).exec()
  req.flash('success', "Demande d'adhésion envoyée avec succès !")
  res.redirect(`/organism/${orga.slug}`)
}

exports.removePendingRequest = async (req, res) => {
  const orga = await Organism.findOneAndUpdate(
    { _id: req.paramString('groupId') },
    {
      $pull: {
        community: {
          user: req.user._id,
          role: 'pending_request'
        }
      }
    },
    {
      new: true, // return the new organism instead of the old one
      runValidators: true
    }
  ).exec()
  req.flash('success', "Votre demande d'adhésion a été annulée !")
  res.redirect(`/organism/${orga.slug}`)
}

exports.acceptPendingRequest = async (req, res) => {
  const orga = await Organism.findOneAndUpdate(
    {
      _id: req.paramString('groupId'),
      'community.user': req.paramString('userId'),
      'community.role': 'pending_request'
    },
    {
      $set: {
        'community.$.role': 'member',
        'community.$.memberDate': Date.now()
      }
    },
    {
      new: true, // return the new organism instead of the old one
      runValidators: true
    }
  ).exec()
  req.flash('success', "Demande d'adhésion envoyée avec succès !")
  res.redirect(`/organism/${orga.slug}`)
}

exports.denyPendingRequest = async (req, res) => {
  const orga = await Organism.findOneAndUpdate(
    {
      _id: req.paramString('groupId'),
      'community.user': req.paramString('userId'),
      'community.role': 'pending_request'
    },
    {
      $set: {
        'community.$.role': 'denied',
        'community.$.memberDate': Date.now()
      }
    },
    {
      new: true, // return the new organism instead of the old one
      runValidators: true
    }
  ).exec()
  req.flash('success', "Demande d'adhésion envoyée avec succès !")
  res.redirect(`/organism/${orga.slug}`)
}

exports.grantPendingRequest = async (req, res) => {
  const orga = await Organism.findOneAndUpdate(
    {
      _id: req.paramString('groupId'),
      'community.user': req.paramString('userId'),
      'community.role': 'denied'
    },
    {
      $set: {
        'community.$.role': 'pending_request',
        'community.$.memberDate': Date.now()
      }
    },
    {
      new: true, // return the new organism instead of the old one
      runValidators: true
    }
  ).exec()
  req.flash('success', "Demande d'adhésion envoyée avec succès !")
  res.redirect(`/organism/${orga.slug}`)
}

exports.quitRequest = async (req, res) => {
  await Organism.findOneAndUpdate(
    { _id: req.paramString('groupId') },
    {
      $pull: {
        community: {
          user: req.user._id
        }
      }
    },
    {
      new: true, // return the new organism instead of the old one
      runValidators: true
    }
  ).exec()
  req.flash('success', 'Vous avez quitter le groupe')
  res.redirect(`/account`)
}
