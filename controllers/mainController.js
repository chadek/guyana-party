exports.homePage = (req, res) => {
  res.render("home", { title: "Liberté Humaine", user: req.user });
};
