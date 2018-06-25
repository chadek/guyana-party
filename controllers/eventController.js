const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const Organism = mongoose.model("Organism");
const { promisify } = require("es6-promisify");
const { getPagedItems, confirmOwner } = require("../handlers/tools");
const store = require("store");

exports.eventsPage = (req, res) => {
  const search = req.bodyString("search") || req.queryString("q") || "";
  let around = req.bodyString("aroundValue") || "";
  res.render("events", { title: "Les évènements sur la carte", search, around, csrfToken: req.csrfToken() });
};

const getTZList = () => {
  const time = Date.now();
  const moment = require("moment-timezone");
  const tzNamesList = moment.tz.names();
  let tzList = [];
  for (let i = 0; i < tzNamesList.length; i++) {
    const zone = moment.tz.zone(tzNamesList[i]);
    const tzValue = moment.tz(time, zone.name).format("Z");
    const selected = moment.tz.guess() == zone.name;
    tzList.push({ id: zone.utcOffset(time), label: `(UTC${tzValue}) ${zone.name}`, value: zone.name, selected });
  }
  tzList.sort((a, b) => b.id - a.id);
  // TODO: filter the values to remove bad ones
  // ...
  return tzList;
};

exports.addPage = (req, res) => {
  const orga = req.queryString("orga");
  res.render("editEvent", {
    orga,
    tzList: getTZList(),
    title: "Création d'un évènement public",
    csrfToken: req.csrfToken()
  });
};

exports.editEvent = async (req, res) => {
  // 1. Find the event given the ID
  const event = await Event.findOne({ _id: req.paramString("id") });
  // 2. confirm they are the owner of the event
  confirmOwner(event, req.user);
  // 3. render out the edit form so the user can update their event
  res.render("editEvent", {
    event,
    tzList: getTZList(),
    title: "Edition de l'évènement",
    csrfToken: req.csrfToken()
  });
};

const bodyFormatDateTime = req => {
  const startDate = req.bodyString("startdate");
  const startTime = req.bodyString("starttime");
  const endDate = req.bodyString("enddate");
  const endTime = req.bodyString("endtime");
  const tz = req.bodyString("tz");
  const moment = require("moment-timezone");
  req.body.start = moment.tz(`${startDate} ${startTime}`, tz).format();
  req.body.end = moment.tz(`${endDate} ${endTime}`, tz).format();
  req.body.timezone = `(UTC${moment.tz(`${startDate} ${startTime}`, tz).format("Z")}) ${tz}`;
  return req.body;
};

exports.create = async (req, res) => {
  store.set("addevents-form-data", req.body); // store body to prefill the register form
  req.sanitizeBody("name");
  req.sanitizeBody("description");
  req.sanitizeBody("location[address]");
  req.sanitizeBody("location[coordinates][0]");
  req.sanitizeBody("location[coordinates][1]");
  req.checkBody("name", "Vous devez saisir le nom de l'évènement.").notEmpty();
  req.checkBody("location[address]", "Veuillez sélectionner le lieu de l'évènement sur la carte.").notEmpty();
  req.checkBody("description", "Veuillez saisir une description de l'évènement.").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    store.set("form-errors", errors.map(err => err.param));
    req.flash("error", errors.map(err => err.msg));
    return res.redirect("/events/add");
  }
  req.body.author = req.user._id;
  req.body.published = !!req.body.published;
  req.body = bodyFormatDateTime(req);
  const event = await new Event(req.body).save();
  req.flash("success", `Evènement "${event.name}" créé avec succès !`);
  res.redirect(`/event/${event.slug}`);
};

exports.updateEvent = async (req, res) => {
  store.set("addevents-form-data", req.body); // store body to prefill the register form
  // set the location data to be a point
  req.body.location.type = "Point";
  // set the updated date
  req.body.updated = new Date();
  req.body.published = !!req.body.published;
  req.body = bodyFormatDateTime(req);

  const event = await Event.findOneAndUpdate({ _id: req.paramString("id") }, req.body, {
    new: true, // return the new event instead of the old one
    runValidators: true
  }).exec();
  req.flash("success", `Evènement <strong>${event.name}</strong> mis à jour. <a href="/event/${event.slug}">Voir</a>`);
  res.redirect(`/events/${event._id}/edit`);
};

exports.getEventBySlug = async (req, res, next) => {
  const event = await Event.findOne({ slug: req.paramString("slug") }).populate("author");
  if (!event) return next();
  if (!event.publish) confirmOwner(event, req.user); // we can't see an event if it's not published and we don't own it
  const orga = await Organism.findOne({ _id: event.organism });
  if (!orga) return next();
  res.render("event", { event, orga, title: event.name, csrfToken: req.csrfToken() });
};

exports.getEvents = async (req, res) => {
  const page = req.queryInt("page") || 1;
  const limit = req.queryInt("limit") || 7;
  const orga = req.queryString("orga");
  let find = orga ? { organism: orga } : { author: req.user._id };
  const result = await getPagedItems(Event, page, limit, find, {}, { created: "desc" });
  res.json(result);
};

exports.getSearchResult = async (req, res) => {
  const page = req.queryInt("page") || 1;
  const limit = req.queryInt("limit") || 10;
  const search = req.queryString("q");
  const lon = req.queryString("lon");
  const lat = req.queryString("lat");
  const maxDistance = req.queryInt("maxdistance") || 10000; // 10km
  let find = {
    $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    published: true
  };
  if (lon && lat) {
    find = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat].map(parseFloat)
          },
          $maxDistance: maxDistance
        }
      },
      $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
      published: true
    };
  }
  const pagedEvents = await getPagedItems(
    Event,
    page,
    limit,
    find,
    {
      score: { $meta: "textScore" },
      _id: false,
      slug: 1,
      name: 1,
      start: 1,
      "location.coordinates": 1
    },
    { score: { $meta: "textScore" } }
  );
  res.json(pagedEvents);
};
