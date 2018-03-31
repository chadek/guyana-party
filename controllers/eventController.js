const mongoose = require("mongoose");
//const Event = mongoose.model("Event");
const { promisify } = require("es6-promisify");

exports.eventsPage = (req, res) => {
  res.render("events", { title: "Tous les évènements sur la carte" });
};

exports.addEventPage = (req, res) => {
  res.render("addEvent", { title: "Ajouter un évènement" });
};
