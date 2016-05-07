var Event = require('../models/Event');
var User = require('../models/User');

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

    User.find({}, function (err, users) {
      users = users || [];
      res.render('event/show', {
        event: event,
        users: users
      });
    });
  });
};

exports.addParticipants = function (req, res) {

  var eventId = req.params.eventId;

  console.log('asdad', req.body.participant);

  Event.findOne({_id: eventId}, function (err, event) {

    User.findOne({_id: userId}, function (err, user) {
      event.participants.push(user);
      res.status(200).send();
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
    location: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]
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