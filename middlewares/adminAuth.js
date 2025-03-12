const adminAuth = (req, res, next) => {
  const isAdmin = true;
  if (isAdmin) {
    next();
  } else {
    res.status(403).send("You are not authorized to access this page");
  }
};
module.exports = { adminAuth };
