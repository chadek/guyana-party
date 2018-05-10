const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const Organism = mongoose.model("Organism");
const { promisify } = require("es6-promisify");
const { getPagedItems } = require("../handlers/tools");

exports.eventsPage = (req, res) => {
  const search = req.bodyString("search") || req.queryString("q") || "";
  let around = req.bodyString("aroundValue") || "";
  res.render("events", { title: "Les évènements sur la carte", search, around, csrfToken: req.csrfToken() });
};

exports.addPage = (req, res) => {
  const orga = req.queryString("orga");
  res.render("editEvent", { event: {}, orga, title: "Création d'un évènement public", csrfToken: req.csrfToken() });
};

exports.canCreate = async (req, res, next) => {
  next();
};

exports.create = async (req, res) => {
  req.body.author = req.user._id;

  let UTC = req.bodyString("timezone");
  let timezone = UTC.match(/([\-+])(\d{2}):(\d{2})$/);
  timezonesec = parseInt(timezone[2])*3600 + parseInt(timezone[3])*60;

  let startDate = req.bodyString("startdate");
  let startTime = req.bodyString("starttime");
  let endDate = req.bodyString("enddate");
  let endTime = req.bodyString("endtime");

  // if (timezone[1] == "+") {
  //   req.body.start = new Date(startDate+"T"+startTime+"Z") + timezonesec;
  //   req.body.end = new Date(endDate+"T"+endTime+"Z") + timezonesec;
  // }else{
  //   req.body.start = new Date(startDate+"T"+startTime+"Z") - timezonesec;
  //   req.body.end = new Date(endDate+"T"+endTime+"Z") - timezonesec;
  // }
  req.body.start = new Date(startDate+"T"+startTime+"Z");
  req.body.end = new Date(endDate+"T"+endTime+"Z");


  console.log("Début ",req.body.start);
  console.log("FIN ",req.body.end);

  const event = await new Event(req.body).save();
  req.flash("success", `Evènement "${event.name}" créé avec succès !`);
  res.redirect(`/event/${event.slug}`);
};

exports.getEventBySlug = async (req, res, next) => {
  const event = await Event.findOne({ slug: req.paramString("slug") }).populate("author");
  if (!event) return next();
  const orga = await Organism.findOne({ _id: event.organism });
  if (!orga) return next();
  res.render("event", { event, orga, title: event.name, csrfToken: req.csrfToken() });
};

exports.getEvents = async (req, res) => {
  const page = req.queryInt("page") || 1;
  const limit = req.queryInt("limit") || 4;
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
  let find = { $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] };
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
      $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
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
