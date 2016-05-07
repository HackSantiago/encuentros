
// check if user have a rut associated with him
exports.isUserWithRUT = function(req, res, next) {
  var user = req.user;
  if (user.profile && user.profile.rut) {
    return next();
  }

  req.flash('errors', { msg: 'Para poder crear o unirte a un encuentro local tienes que tener un RUT asociado' });
  res.redirect('/account');
};
