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

exports.homePage = (req, res) => {
  res.render("home", { title: "Liberté Humaine" });
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
  await photo.write(`./public/uploads/${req.bodyString("photo")}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.subscriptions = (req, res) => {
  res.render("subscriptions", { title: "Choisissez une souscription" });
};
