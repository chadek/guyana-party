const mongoose = require('mongoose')
const store = require('store')
const moment = require('moment-timezone')
const {
  getPagedItems,
  getTZList,
  confirmMember,
  isAdminCheck,
  lookForNextOcurring
} = require('../handlers/tools')

const Event = mongoose.model('Event')
const Group = mongoose.model('Group')

exports.isAdmin = async (req, res, next) =>
  isAdminCheck(req, res, next, Event, 'event')

exports.addPage = (req, res) => {
  const group = req.queryString('group')
  res.render('editEvent', {
    group,
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
    return res.redirect('/event/add')
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
  res.redirect(`/event/${event.slug}`)
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

  const isAdmin = confirmMember(req.user, event.group, 'admin')

  const isMember = confirmMember(req.user, event.group, 'member')

  let remove = false
  if (req.queryString('remove')) remove = true

  // we can't see an event if it's not published and we don't own it
  //   or we can't remove the event if not admin
  if (!(isAdmin || (isMember && (event.status == 'published' || remove)) || (event.status == 'published' && (event.public)))) {
    req.flash('error', 'Vous ne pouvez pas accéder aux informations de cet évènement !')
    return res.redirect('back')
  }

  event.nextTime = lookForNextOcurring(event)

  res.render('event', {
    title: event.name,
    csrfToken: req.csrfToken(),
    event,
    isAdmin,
    remove
  })
}

/** route: /api/events */
exports.getEvents = async (req, res) => {
  const page = req.queryInt('page') || 1
  const limit = req.queryInt('limit') || 7
  const groupId = req.queryString('group')
  const archived = req.queryString('archived')
  // We want events by status, group (if available) otherwise by author
  const status = archived ? '^archived$' : '^((?!archived).)*$'

  // By default we are on account page:  we filter by author and status
  let find = {
    author: req.user ? req.user._id : '',
    status: { $regex: status, $options: 'i' }
  }

  if (groupId) {
    // We are here on group page: we filter by groupId
    find = { group: groupId }
    if (req.user) {
      // We are connected, we're gonna check that we are admin
      const group = await Group.findOne({ _id: groupId })
      if (!confirmMember(req.user, group, 'admin')) {
        // We are not admin (perhaps member): we see only published
        find.status = 'published'
        if (!confirmMember(req.user, group, 'member')) {
          // We are not member: the event has to be public
          find.public = true
        }
      }
    } else {
      // We are not connected: we see only published and public events
      find.status = 'published'
      find.public = true
    }
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
  const cbx = req.queryFloat('cbx')
  const cby = req.queryFloat('cby')
  const chx = req.queryFloat('chx')
  const chy = req.queryFloat('chy')

  // console.log("L'utilisateur est : ", req.user)

  if (req.user) {
    console.log("le user est", req.user.name, "avec l'id", req.user.id, req.user._id)
    // rechercher les groupes dans lequel ce dernier est 
    const adminGroups = await Group.find(
      {
        community: {
          "$elemMatch": { user: req.user._id, role: "admin" }
        },
      },
      {
        name: 1,
      }

    )

    // console.log("adminGroups de", req.user.name,)
    // adminGroups.forEach(group => {
    //   console.log(group.name)
    // });
    console.log("Mes admingroup : ", adminGroups)
    // [
    //   {
    //     _id: 5d91d5988a30760cfc3416fe,
    //     name: 'new',
    //     id: '5d91d5988a30760cfc3416fe'
    //   },
    //   {
    //     _id: 5d927d96a8b78e671e8960de,
    //     name: 'troisième groupe',
    //     id: '5d927d96a8b78e671e8960de'
    //   }
    // ]


    const memberGroups = await Group.find({
      community: {
        "$elemMatch": { user: req.user._id, role: "member" }
      },
    },
      {
        name: 1
      })

    console.log("Mes membergroup : ", memberGroups)

    // console.log("memberGroups de", req.user.name)
    // memberGroups.forEach(group => {
    //   console.log(group.name)
    // });

  } else {
    console.log("Pas d'utilisateur connecté")
  }

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
  if (cbx && cby && chx && chy) {
    find.location = {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [[cbx, cby], [chx, cby], [chx, chy], [cbx, chy], [cbx, cby]]
          ],
          crs: {
            type: "name",
            properties: { name: "urn:x-mongodb:crs:strictwinding:EPSG:4326" }
          }
        }
      }
    }

    //ou 
    // find.location = {
    //   $geoWithin: {
    //     $box: [[cbx, cby],[chx, chy]
    //     ]
    //   }
    // }
    // ou 

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

  console.log("pages event : ")
  console.log(pagedEvents)
  res.json(pagedEvents)
}
