const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const mail = require("../handlers/mail");

exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Connexion échouée !",
  successRedirect: "/",
  successFlash: "Connexion réussie !"
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;
  }
  req.flash("error", "Vous devez être connecté(e) pour voir cette page !");
  res.redirect("/login");
};

exports.forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    // 2. Set reset tokens and expiry on their account
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // 3. Send them an email with the token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
      user,
      subject: "Réinitialisation de votre mot de passe",
      resetURL,
      filename: "password-reset"
    });
  }
  // 4. flash the message
  req.flash(
    "success",
    `Un email vient de vous être envoyé à ${
      req.body.email
    }. Cet email contient un lien vous permettant de récupérer votre mot de passe.`
  );
  // 5. redirect to login page
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash("error", "Le lien de récupération du mot de passe est invalide ou a expiré.");
    return res.redirect("/login");
  }
  // if there is a user, show the reset password form
  res.render("reset", { title: "Réinitialisez votre mot de passe" });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    next(); // keepit going!
    return;
  }
  req.flash("error", "Les mots de passe ne correspondent pas !");
  res.redirect("back");
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash("error", "Le lien de récupération du mot de passe est invalide ou a expiré.");
    return res.redirect("/login");
  }
  await user.setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash("success", "Votre mot de passe a été réinitialisé ! Vous êtes maintenant connecté(e) !");
  res.redirect("/");
};
