var R = require('ramda');

var Event = require('../models/Event');
var User = require('../models/User');


exports.index = function(req, res) {
  var params = R.pick(['text'], req.query);

  Event.findByText(params.text)
  .then(function(events) {
    events = events || [];

    events = events.map(function(event) {
      return  {
        id: event.id,
        location: {
          lng: event.location[0],
          lat: event.location[1]
        },
        title: event.title
      }
    });
    
    res.render('event/index', {
      events: events,
      query: params.text
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
  var eventId = req.params.eventId,
      participant = req.body.participant;

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
    desc: req.body.desc,
    url: req.body.url,
    address: req.body.address,
    location: [req.body.longitude, req.body.latitude]
  });

  event.save(function (err, savedEvent) {
    if (err) return next(err);
    res.redirect('/event/' + savedEvent._id);
  });
};

exports.getCreate = function (req, res) {
  Event.findOne(createUserFilter(req.user), function(err, foundEvent) {
    console.log(foundEvent)
    if (foundEvent) {
      req.flash('errors', {msg: 'Ya eres parte de un evento'})
      return res.redirect('/event/my-event');
    }
    res.render('event/new');
  });
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

exports.myEvent = function(req, res) {
  Event.findOne(createUserFilter(req.user)).populate('moderator').exec(function(err, event) {
    if (err || !event) return next(err);
    console.log(event)
    res.render('event/my-event', {
      event: event
    });
  })
};

function createUserFilter(user) {
  return {$or:[{moderator: user}, {participants: {$in: [user]}}]}
}
