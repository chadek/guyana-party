const mongoose = require("mongoose");
const Organism = mongoose.model("Organism");
const { promisify } = require("es6-promisify");
const { getPagedItems } = require("../handlers/tools");

exports.addPage = (req, res) => {
  res.render("editOrganism", { orga: {}, title: "Création d'un organisme", csrfToken: req.csrfToken() });
};

exports.create = async (req, res) => {
  req.body.author = req.user._id;
  const orga = await new Organism(req.body).save();
  req.flash("success", `Organisme "${orga.name}" créé avec succès !`);
  res.redirect(`/organism/${orga.slug}`);
};

exports.getOrgaBySlug = async (req, res, next) => {
  const orga = await Organism.findOne({ slug: req.paramString("slug") }).populate("author");
  if (!orga) return next();
  res.render("organism", { orga, title: orga.name, csrfToken: req.csrfToken() });
};

exports.getOrganisms = async (req, res) => {
  const page = req.queryInt("page") || 1;
  const limit = req.queryInt("limit") || 4;
  const result = await getPagedItems(Organism, page, limit, { author: req.user._id }, {}, { created: "desc" });
  res.json(result);
};
