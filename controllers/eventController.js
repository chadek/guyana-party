const mongoose = require('mongoose')

const Event = mongoose.model('Event')
const Organism = mongoose.model('Organism')
// const { promisify } = require("es6-promisify");
const store = require('store')
const moment = require('moment-timezone')
const { getPagedItems, confirmOwner } = require('../handlers/tools')

// exports.eventsPage = (req, res) => {
//   const search = req.bodyString('search') || req.queryString('q') || ''
//   const around = req.bodyString('aroundValue') || ''
//   res.render('events', {
//     title: 'Les évènements sur la carte',
//     search,
//     around,
//     csrfToken: req.csrfToken()
//   })
// }

const getTZList = () => {
  const time = Date.now()
  const moment = require('moment-timezone')
  // const moment = moment.tz.pack(require("../public/vendor/timezone/latest.json"));
  moment.tz.load(require('../public/vendor/timezone/timezone.json'))
  // conlole.log(momenttz);
  const tzNamesList = moment.tz.names()
  let tzList = []
  for (let i = 0; i < tzNamesList.length; i++) {
    const zone = moment.tz.zone(tzNamesList[i])
    const tzValue = moment.tz(time, zone.name).format('Z')
    const selected = moment.tz.guess() === zone.name

    tzList.push({
      id: zone.utcOffset(time),
      label: `(UTC${tzValue}) ${zone.name}`,
      value: zone.name,
      selected
    })
  }
  tzList.sort((a, b) => b.id - a.id)
  // TODO: filter the values to remove bad ones
  // ...
  return tzList
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
  // 1. Find the event given the ID
  const event = await Event.findOne({ _id: req.paramString('id') })
  // 2. confirm they are the owner of the event
  confirmOwner(event, req.user)
  // 3. render out the edit form so the user can update their event
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
  confirmOwner(event, req.user) // we can't (un)publish an event if we don't own it
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
  confirmOwner(event, req.user) // we can't (un)publish an event if we don't own it
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
  confirmOwner(event, req.user) // we can't remove an event if we don't own it
  event.status = 'archived'
  await event.save()
  req.flash('success', `Votre évènement a été archivé.`)
  res.redirect('/account')
}

exports.getEventBySlug = async (req, res, next) => {
  const event = await Event.findOne({ slug: req.paramString('slug') })
  // .populate(
  //   'author'
  // )
  if (!event) return next()
  if (event.status !== 'published') confirmOwner(event, req.user) // we can't see an event if it's not published and we don't own it
  let remove = false
  if (req.queryString('remove')) {
    remove = true
  }
  const orga = await Organism.findOne({ _id: event.organism })
  if (!orga) return next()
  const isOwner = req.user && event.author.equals(req.user._id)
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
  // We want events by status, organism (if available) otherwise by author
  const find = orga
    ? {
      organism: orga,
      status: { $regex: '^((?!archived).)*$', $options: 'i' }
    }
    : {
      author: req.user._id,
      status: { $regex: '^((?!archived).)*$', $options: 'i' }
    }
  // Paginate the events list
  const result = await getPagedItems(Event, page, limit, find, {}, { start: 1 })
  res.json(result)
}

/** route : /api/search */
exports.getSearchResult = async (req, res) => {
  const page = req.queryInt('page') || 1
  const limit = req.queryInt('limit') || 0
  const search = req.queryString('q')
  const lon = req.queryString('lon')
  const lat = req.queryString('lat')
  const maxDistance = req.queryInt('maxdistance') || 10000 // 10km
  // We want published events by location (if available), name or description
  let find = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ],
    status: 'published',
    start: { $lte: Date.now() },
    end: { $gte: Date.now() },
    public: true
  }
  if (lon && lat) {
    find.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lon, lat].map(parseFloat)
        },
        $maxDistance: maxDistance
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
      photo: 1,
      'location.coordinates': 1
    },
    { start: 1 }
  )
  res.json(pagedEvents)
}
