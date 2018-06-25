const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2097152 // 1024 * 1024 * 2 (2Mo)
  },
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "Type de fichier non autorisé !" }, false);
    }
  }
};

exports.upload = (req, res, next) => {
  const mult = multer(multerOptions).single("photo");
  mult(req, res, err => {
    if (err) {
      // An error occurred when uploading
      req.flash("error", err.code == "LIMIT_FILE_SIZE" ? "Le fichier ne doit pas dépasser 2Mo !" : err.message);
      return res.redirect("back");
    }
    // Everything went fine
    next();
  });
};

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
  await photo.write(`./public/uploads/${req.bodyString("photo")}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.homePage = (req, res) => {
  require("store").clearAll(); // clear all data stored
  res.render("home", { title: "Liberté Humaine", csrfToken: req.csrfToken() });
};
