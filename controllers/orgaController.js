const mongoose = require("mongoose");
const Organism = mongoose.model("Organism");
const { getPagedItems, confirmOwner } = require("../handlers/tools");

exports.addPage = (req, res) => {
  res.render("editOrganism", { title: "Création d'un Groupe", csrfToken: req.csrfToken() });
};

exports.create = async (req, res) => {
  req.body.author = req.user._id;
  const orga = await new Organism(req.body).save();
  req.flash("success", `Organisme "${orga.name}" créé avec succès !`);
  res.redirect(`/organism/${orga.slug}`);
};

exports.editOrga = async (req, res) => {
  // 1. Find the organism given the ID
  const orga = await Organism.findOne({ _id: req.paramString("id") });
  // 2. confirm they are the owner of the organism
  confirmOwner(orga, req.user);
  // 3. render out the edit form so the user can update their organism
  res.render("editOrganism", {
    orga,
    title: "Edition du Groupe",
    csrfToken: req.csrfToken()
  });
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
