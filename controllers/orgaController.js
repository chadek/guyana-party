const mongoose = require("mongoose");
const Organism = mongoose.model("Organism");
const { promisify } = require("es6-promisify");
const { getPagedItems } = require("../handlers/tools");

exports.addPage = (req, res) => {
  res.render("addOrganism", { orga: {}, title: "Création d'un organisme" });
};

exports.create = async (req, res) => {
  req.body.author = req.user._id;
  const orga = await new Organism(req.body).save();
  req.flash("success", `Organisme "${orga.name}" créé avec succès !`);
  res.redirect(`/organism/${orga.slug}`);
};

exports.getOrgaBySlug = async (req, res, next) => {
  const orga = await Organism.findOne({ slug: req.params.slug }).populate("author");
  if (!orga) return next();
  res.render("organism", { orga, title: orga.name });
};

// exports.getOrgaById = async (req, res) => {
//   const orga = await Organism.findOne({ _id: req.params.id }).populate("author");
//   if (!orga) return res.json({});
//   res.json(orga);
// };

exports.getOrganisms = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 4;
  const result = await getPagedItems(Organism, page, limit, { author: req.user._id }, {}, { created: "desc" });
  res.json(result);
};
