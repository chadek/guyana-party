const mongoose = require("mongoose");
const User = mongoose.model("User");
const { promisify } = require("es6-promisify");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "Type de fichier non autorisé !" }, false);
    }
  }
};

exports.loginForm = (req, res) => {
  res.render("login", { title: "Connexion/Inscription" });
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
  // TODO: validate picture
  // ...
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
  res.render("account", { title: "Gestion de votre compte" });
};

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  // check if there is no file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};
