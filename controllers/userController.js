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
  req.checkBody("password-confirm", "Oops! Your passwords do not match").equals(req.bodyString("password"));

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
  const user = new User({
    email: req.bodyEmail("email"),
    name: req.bodyString("name"),
    photo: req.bodyString("photo")
  });
  const register = promisify(User.register.bind(User));
  await register(user, req.bodyString("password"));
  next(); // pass to authController.login
};

exports.account = (req, res) => {
  res.render("account", { title: "Votre compte" });
};

exports.hasOrganism = async (req, res, next) => {
  const orga = await Organism.findOne({ author: req.user._id });
  if (!orga) {
    req.flash("error", "Vous devez créer un organisme avant de créer votre évènement.");
    res.redirect("/organisms/add");
    return;
  }
  next();
};

exports.hasSubscription = async (req, res, next) => {
  const user = await User.findOne({
    _id: req.user._id,
    $where: function() {
      return ["free", "asso", "pro", "complete"].includes(this.subscription);
    }
  });
  if (!user) {
    req.flash("error", "Choisissez une souscription pour la création de votre organisme.");
    res.redirect("/souscriptions");
    return;
  }
  next();
};

exports.editAccount = (req, res) => {
  res.render("editAccount", { title: "Edition de votre compte" });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.bodyString("name"),
    email: req.bodyEmail("email"),
    photo: req.bodyString("photo")
  };
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );
  req.flash("success", "Compte mis à jour !");
  res.redirect("back");
};
