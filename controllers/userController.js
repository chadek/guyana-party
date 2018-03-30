const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");

exports.connexionForm = (req, res) => {
  res.render("connexion", { title: "Connexion"});
};
