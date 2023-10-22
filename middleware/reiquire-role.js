module.exports = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      return next();
    } else {
      res.status(403).send('Access Denied');
    }
  }
}