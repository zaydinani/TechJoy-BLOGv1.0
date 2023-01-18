exports.getLogin = (req, res, next) => {
  res.render("login-singup");
};
exports.getContact = (req, res, next) => {
  res.render("contact");
};
exports.getFAQ = (req, res, next) => {
  res.render("FAQ");
};
exports.getBlogPage = (req, res, next) => {
  res.render("blog");
};
exports.getHome = (req, res, next) => {
  res.render("home");
};
