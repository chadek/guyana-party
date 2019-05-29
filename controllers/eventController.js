const mongoose = require('mongoose')
const store = require('store')
const moment = require('moment-timezone')
const {
  getPagedItems,
  getTZList,
  confirmMember,
  lookForNextOcurring
} = require('../handlers/tools')

const Event = mongoose.model('Event')
const Organism = mongoose.model('Organism')

exports.isAdmin = async (req, res, next) => {
  const event = await Event.findOne({ _id: req.paramString('id') })
  const isAdmin = event && confirmMember(req.user, event.organism, 'admin')
  if (isAdmin) {
    next() // carry on! They are admin!
    return
  }
  req.flash('error', 'Vous ne pouvez pas effectuer cette action !')
  res.redirect(`/event/${event.slug}`)
}

exports.addPage = (req, res) => {
  const orga = req.queryString('orga')
  res.render('editEvent', {
    orga,
    tzList: getTZList(),
    title: "Création d'un évènement",
    csrfToken: req.csrfToken()
  })
}

exports.editEventPage = async (req, res) => {
  const event = await Event.findOne({ _id: req.paramString('id') })

  res.render('editEvent', {
    event,
    tzList: getTZList(),
    title: "Edition de l'évènement",
    csrfToken: req.csrfToken()
  })
}

const bodyFormatDateTime = req => {
  const startDate = req.bodyString('startdate')
  const startTime = req.bodyString('starttime')
  const endDate = req.bodyString('enddate')
  const endTime = req.bodyString('endtime')
  const tz = req.bodyString('tz')
  req.body.start = moment.tz(`${startDate} ${startTime}`, tz).format()
  req.body.end = moment.tz(`${endDate} ${endTime}`, tz).format()
  req.body.timezone = `(UTC${moment
    .tz(`${startDate} ${startTime}`, tz)
    .format('Z')}) ${tz}`
  return req.body
}

exports.create = async (req, res) => {
  store.set('editevents-form-data', req.body) // store body to prefill the register form
  req.sanitizeBody('name')
  req.sanitizeBody('description')
  req.sanitizeBody('location[address]')
  req.sanitizeBody('location[coordinates][0]')
  req.sanitizeBody('location[coordinates][1]')
  req.checkBody('name', "Vous devez saisir le nom de l'évènement.").notEmpty()
  req
    .checkBody(
      'location[address]',
      "Veuillez sélectionner le lieu de l'évènement sur la carte."
    )
    .notEmpty()
  req.checkBody('description', 'Veuillez saisir une description.').notEmpty()
  const errors = req.validationErrors()
  if (errors) {
    store.set('form-errors', errors.map(err => err.param))
    req.flash('error', errors.map(err => err.msg))
    return res.redirect('/events/add')
  }
  req.body.author = req.user._id
  req.body = bodyFormatDateTime(req)

  // TODO: Check the number of events already created to limit the process

  const event = await new Event(req.body).save()
  req.flash('success', `Evènement "${event.name}" créé avec succès !`)
  res.redirect(`/event/${event.slug}`)
}

exports.updateEvent = async (req, res, next) => {
  store.set('editevents-form-data', req.body) // store body to prefill the register form
  req.sanitizeBody('name')
  req.sanitizeBody('description')
  req.sanitizeBody('location[address]')
  req.sanitizeBody('location[coordinates][0]')
  req.sanitizeBody('location[coordinates][1]')
  req.checkBody('name', "Vous devez saisir le nom de l'évènement.").notEmpty()
  req
    .checkBody(
      'location[address]',
      "Veuillez sélectionner le lieu de l'évènement sur la carte."
    )
    .notEmpty()
  req.checkBody('description', 'Veuillez saisir une description.').notEmpty()
  const errors = req.validationErrors()
  if (errors) {
    store.set('form-errors', errors.map(err => err.param))
    req.flash('error', errors.map(err => err.msg))
    return res.redirect('back')
  }
  // set the location data to be a point
  req.body.location.type = 'Point'
  // set the updated date
  req.body.updated = new Date()
  // req.body.published = !!req.body.published;
  req.body = bodyFormatDateTime(req)

  const event = await Event.findOneAndUpdate(
    { _id: req.paramString('id') },
    req.body,
    {
      new: true, // return the new event instead of the old one
      runValidators: true
    }
  ).exec()
  // event = await Event.update(req.body).save();
  req.flash(
    'success',
    `Evènement <strong>${event.name}</strong> mis à jour. <a href="/event/${
      event.slug
    }">Voir</a>`
  )
  res.redirect(`/events/${event._id}/edit`)
}

exports.publish = async (req, res, next) => {
  const event = await Event.findOne({ _id: req.paramString('id') }).populate(
    'author'
  )
  if (!event) return next()

  const published = !req.queryString('cancel')
  event.status = published ? 'published' : 'paused'
  await event.save()

  req.flash(
    'success',
    `Votre évènement est <strong>${
      published ? 'publié' : 'non publié'
    }</strong>.`
  )
  res.redirect('back')
}

exports.goPublic = async (req, res, next) => {
  const event = await Event.findOne({ _id: req.paramString('id') }).populate(
    'author'
  )
  if (!event) return next()

  const isPublic = !req.queryString('cancel')
  event.public = isPublic
  await event.save()

  req.flash(
    'success',
    `Votre évènement est <strong>${isPublic ? 'public' : 'privé'}</strong>.`
  )
  res.redirect('back')
}

exports.remove = async (req, res, next) => {
  const event = await Event.findOne({ _id: req.paramString('id') }).populate(
    'author'
  )
  if (!event) return next()

  event.status = 'archived'
  await event.save()

  req.flash('success', 'Votre évènement a été archivé.')
  res.redirect('/account')
}

exports.getEventBySlug = async (req, res, next) => {
  const event = await Event.findOne({ slug: req.paramString('slug') })
  if (!event) return next()

  // we can't see an event if it's not published and we don't own it
  if (
    event.status !== 'published' &&
    !confirmMember(req.user, event.organism, 'admin')
  ) {
    req.flash('error', 'Vous ne pouvez pas effectuer cet action !')
    return next()
  }

  let remove = false
  if (req.queryString('remove')) remove = true

  const orga = await Organism.findOne({ _id: event.organism })
  if (!orga) return next()
  const isOwner = req.user && event.author.equals(req.user._id)

  event.nextTime = lookForNextOcurring(event)

  res.render('event', {
    event,
    orga,
    title: event.name,
    csrfToken: req.csrfToken(),
    remove,
    isOwner
  })
}

/** route: /api/events */
exports.getEvents = async (req, res) => {
  const page = req.queryInt('page') || 1
  const limit = req.queryInt('limit') || 7
  const orga = req.queryString('orga')
  const archived = req.queryString('archived')
  // We want events by status, organism (if available) otherwise by author
  const status = archived ? '^archived$' : '^((?!archived).)*$'
  // sans connexion(voir que les events public)
  const find = orga
    ? {
      organism: orga,
      // status: { $regex: status, $options: 'i' },
      status: 'published',
      public: true
    }
    : {
      author: req.user._id,
      status: { $regex: status, $options: 'i' }
    }
  // Paginate the events list
  const result = await getPagedItems(
    Event,
    page,
    limit,
    find,
    {},
    { start: -1 }
  )
  res.json(result)
}

/** route : /api/search */
exports.getSearchResult = async (req, res) => {
  const page = req.queryInt('page') || 1
  const limit = req.queryInt('limit') || 10
  const search = req.queryString('q')
  const lon = req.queryString('lon')
  const lat = req.queryString('lat')
  const maxDistance = req.queryInt('maxdistance') || 10000 // 10km
  // We want published events by location (if available), name or description
  const find = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ],
    status: 'published',
    end: { $gte: Date.now() },
    public: true
  }
  if (lon && lat) {
    // TODO: content the map's corner
    find.location = {
      $geoWithin: {
        $centerSphere: [
          [lon, lat].map(parseFloat),
          maxDistance / 1609.34 / 3963.2 // conversion meter to miles and divided by the earth's radius (miles)
        ]
      }
    }
  }
  // Paginate the events list
  const pagedEvents = await getPagedItems(
    Event,
    page,
    limit,
    find,
    {
      _id: false,
      slug: 1,
      name: 1,
      start: 1,
      end: 1,
      photo: 1,
      occurring: 1,
      'location.coordinates': 1
    },
    { start: 1 }
  )
  res.json(pagedEvents)
}
