var Event = require('../models/Event');

exports.index = function(req, res) {
  Event.find({}, function(err, events) {
    res.render('event/index', {
      title: 'Events',
      events: events
    });
  });
};

exports.show = function(req, res) {
  var eventId = req.params.eventId;

  Event.findOne({_id: eventId}, function (err, event) {
    res.render('event/show', {
      event: event
    });

  });
};

exports.create = function(req, res) {
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var event = new Event({
    moderator: req.user,
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    location: [req.body.latitude, req.body.longitude]
  });

  // validate not same creator
  event.save(function (err, savedEvent) {
    if (err) return next(err);

    res.redirect('/event');
  });
};

exports.getCreate = function (req, res) {
  res.render('event/new');
};

exports.attend = function (req, res) {

};

exports.update = function (req, res) {
  var eventId = req.params.eventId;

  Event.findOne({ _id: eventId}, function(err, event) {
    if (err) return next(err);
    event.save(function (err, event) {
      req.flash('success', { msg: 'Evento actualizado.' });
      res.redirect('/account');
    });
  });
};

exports.getUpdate = function(req, res) {
  var eventId = req.params.eventId;

  Event.findOne({ _id: eventId}, function(err, event) {
    if (err || !event) return next(err);

    res.render('event/update', {
      event: event
    });
  });
};