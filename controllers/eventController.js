const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const Organism = mongoose.model("Organism");
const { promisify } = require("es6-promisify");
const { getPagedItems } = require("../handlers/tools");

exports.eventsPage = (req, res) => {
  const search = req.body.search || req.query.q || "";
  const around = req.body.aroundValue;
  console.log("toto",around);
  res.render("events", { title: "Les évènements sur la carte", search, around });
};

exports.addEventPage = (req, res) => {
  const orga = req.query.orga;
  res.render("addEvent", { event: {}, orga, title: "Création d'un évènement public" });
};

exports.create = async (req, res) => {
  req.body.author = req.user._id;
  const startDate = req.body.startdate;
  const startTime = req.body.starttime;
  const endDate = req.body.enddate;
  const endTime = req.body.endtime;
  req.body.start = new Date(
    startDate.split("/")[2],
    startDate.split("/")[1],
    startDate.split("/")[0],
    startTime.split(":")[0],
    startTime.split(":")[1],
    0,
    0
  );
  req.body.end = new Date(
    endDate.split("/")[2],
    endDate.split("/")[1],
    endDate.split("/")[0],
    endTime.split(":")[0],
    endTime.split(":")[1],
    0,
    0
  );
  //res.json(req.body);return;
  const event = await new Event(req.body).save();
  req.flash("success", `Evènement "${event.name}" créé avec succès !`);
  res.redirect(`/event/${event.slug}`);
};

exports.getEventBySlug = async (req, res, next) => {
  const event = await Event.findOne({ slug: req.params.slug }).populate("author");
  if (!event) return next();
  const orga = await Organism.findOne({ _id: event.organism });
  if (!orga) return next();
  res.render("event", { event, orga, title: event.name });
};

exports.getEvents = async (req, res) => {
  const page = req.queryInt("page") || 1;
  const limit = req.queryInt("limit") || 4;
  const orga = req.queryString("orga");
  let find = { author: req.user._id };
  if (orga) {
    find = { organism: orga };
  }
  const result = await getPagedItems(Event, page, limit, find, {}, { created: "desc" });
  res.json(result);
};

exports.getSearchResult = async (req, res) => {
  const page = req.queryInt("page") || 1;
  const limit = req.queryInt("limit") || 10;
  const search = req.queryString("q");
  const orga = req.queryString("orga");
  let pagedEvents = await getPagedItems(
    Event,
    page,
    limit,
    search ? { $text: { $search: search } } : {},
    { score: { $meta: "textScore" } },
    { score: { $meta: "textScore" } }
  );
  res.json(pagedEvents);
};
