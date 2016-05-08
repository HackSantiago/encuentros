
// check if user have a rut associated with him
exports.isUserWithRUT = function(req, res, next) {
  var user = req.user;
  if (user.profile && user.profile.rut && user.profile.name) {
    return next();
  }

  req.flash('errors', { msg: 'Para poder crear o unirte a un encuentro local tienes que ingresar tu RUT y tu nombre en tu perfil' });
  res.redirect('/account');
};
