var R = require('ramda');

var Event = require('../models/Event');
var User = require('../models/User');


exports.index = function(req, res) {
  var params = R.pick(['text'], req.query);

  Event.findByText(params.text)
  .then(function(events) {

    res.render('event/index', {events: events});
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
    location: [req.body.longitude, req.body.latitude]
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
