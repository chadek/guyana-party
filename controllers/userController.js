const mongoose = require("mongoose");
const User = mongoose.model("User");
const Organism = mongoose.model("Organism");
const { promisify } = require("es6-promisify");

exports.loginForm = (req, res) => {
  res.render("login", { title: "Connexion/Inscription", isLogin: true });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody("name");
  req.checkBody("name", "You must supply a name!").notEmpty();
  req.checkBody("email", "That Email is not valid!").isEmail();
  req.sanitizeBody("email").normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody("password", "Password Cannot be Blank!").notEmpty();
  req.checkBody("password-confirm", "Confirmed Password Cannot be Blank!").notEmpty();
  req.checkBody("password-confirm", "Oops! Your passwords do not match").equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors.map(err => err.msg));
    res.render("login", {
      title: "Connexion/Inscription",
      body: req.body,
      flashes: req.flash(),
      isRegisterForm: true
    });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name, photo: req.body.photo });
  const register = promisify(User.register.bind(User));
  await register(user, req.body.password);
  next(); // pass to authController.login
};

exports.account = (req, res) => {
  res.render("account", { title: "Votre compte" });
};

exports.hasOrganism = async (req, res, next) => {
  const orga = await Organism.findOne({ author: req.user._id });
  if (!orga) {
    req.flash("error", "Vous devez ajouter un organisme avant de créer un évènement !");
    res.render("addOrganism", { orga: {}, title: "Création d'un organisme" });
    return;
  }
  next();
};

exports.editAccount = (req, res) => {
  res.render("editAccount", { title: "Edition de votre compte" });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo
  };
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );
  req.flash("success", "Compte mis à jour !")
  res.redirect("back");
};
