const mongoose = require("mongoose");
const Organism = mongoose.model("Organism");
const { promisify } = require("es6-promisify");
const { getPagedItems } = require("../handlers/tools");

// const getPagedOrgas = async (page, limit, find, projection, sort) => {
//   page = parseInt(page);
//   limit = parseInt(limit);
//   if (!page || !limit) return { isErrorPage: true, error: "page and limit parameters must be integers" };
//   const skip = page * limit - limit;
//   const orgasPromise = Organism.find(find, projection)
//     .skip(skip)
//     .limit(limit)
//     .sort(sort);
//   const [orgas, count] = await Promise.all([orgasPromise, Organism.count(find)]);
//   return {
//     orgas,
//     page,
//     pages: Math.ceil(count / limit),
//     count,
//     isErrorPage: !orgas.length && skip
//   };
// };

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

exports.getOrganisms = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 4;
  const result = await getPagedItems(Organism, page, limit, { author: req.user._id }, {}, { created: "desc" });
  res.json(result);
};

// exports.getOrganisms = async (find, page, limit) => {
//   page = page || 1;
//   limit = limit || 4;
//   const result = await getPagedOrgas(page, limit, find, {}, { created: "desc" });
//   return result;
// };
