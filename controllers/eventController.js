const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const { promisify } = require("es6-promisify");

exports.eventsPage = (req, res) => {
  res.render("events", { title: "Tous les évènements sur la carte" });
};

exports.addEventPage = (req, res) => {
  res.render("addEvent", { event: {}, title: "Créer un évènement public" });
};

exports.createEvent = async (req, res) => {
  req.body.author = req.user._id;
  const startDate = req.body.startdate;
  const startTime = req.body.starttime;
  const endDate = req.body.enddate;
  const endTime = req.body.endtime;
  req.body.start = new Date(Date.UTC(
    startDate.split('/')[2],
    startDate.split('/')[1],
    startDate.split('/')[0],
    startTime.split(':')[0],
    startTime.split(':')[1],0,0));
  req.body.end = new Date(Date.UTC(
    endDate.split('/')[2],
    endDate.split('/')[1],
    endDate.split('/')[0],
    endTime.split(':')[0],
    endTime.split(':')[1],0,0));
  //res.json(req.body);return;
  const event = await new Event(req.body).save();
  req.flash("success", `Evènement "${event.name}" créé avec succès !`);
  res.redirect(`/event/${event.slug}`);
};

exports.getEventBySlug = async (req, res, next) => {
  const event = await Event.findOne({ slug: req.params.slug }).populate("author");
  if (!event) return next();
  res.render("event", { event, title: event.name });
};