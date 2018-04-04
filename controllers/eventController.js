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
  const event = await new Event(req.body).save();
  req.flash("success", `Evènement "${event.name}" créé avec succès !`);
  res.redirect(`/events/${event.slug}`);
};

exports.getEventBySlug = async (req, res, next) => {
  const event = await Event.findOne({ slug: req.params.slug }).populate("author");
  if (!event) return next();
  res.render("event", { event, title: event.name });
};