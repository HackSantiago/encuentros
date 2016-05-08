var R = require('ramda');

var Event = require('../models/Event');
var User = require('../models/User');
var Promise = require('bluebird');
var moment = require('moment');
var format = 'DD-MM-YYYY hh:mm a'


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
        title: event.title,
        date: moment(event.date).format(format)
      }
    });
    
    res.render('event/index', {
      events: events,
      query: params.text
    });
  });
};

exports.getEventsNearToLocation = function(req, res) {
  var params = R.pick(['location', 'distance'], req.query);

  Event.findByLocation(params)
  .then(function(events) {
    res.send({events: events || []});
  });
};

exports.show = function(req, res) {
  var eventId = req.params.eventId;
  var findEventPromise = findEvent({_id: eventId}).exec();
  Promise.all([isPartOfEvent(req.user), findEventPromise]).then(function(results) {
    var event = results[1];
    event.dateFormatted = moment(event.date).format(format)
    res.render('event/show', {
      event: event,
      isPartOfEvent: results[0],
      loggedIn: !!req.user
    });
  })
};

exports.addParticipants = function (req, res) {
  var eventId = req.params.eventId,my
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
    date: moment(req.body.date, 'DD-MM-YYYY hh:mm a'),
    location: [req.body.longitude, req.body.latitude]
  });

  event.save(function (err, savedEvent) {
    if (err) return next(err);
    res.redirect('/event/' + savedEvent._id);
  });
};

exports.getCreate = function (req, res) {
  isPartOfEvent(req.user).then(function(result) {
    // if (result) {
    //   req.flash('errors', {msg: 'Ya eres parte de un encuentro'});
    //   return res.redirect('/event/my-event');
    // }
    res.render('event/new');
  })
};

exports.join = function (req, res) {
  isPartOfEvent(req.user).then(function(result) {
    if (result) {
      req.flash('errors', {msg: 'Ya eres parte de un encuentro'});
      return res.redirect('/event/my-event');
    }
    var eventId = req.body.eventId
    Event.findOne({ _id: eventId}, function(err, event) {
      if (err) return next(err);
      if (!event) {
        return res.redirect('/event');
      }
      event.participants.push(req.user);
      event.save(function (err, event) {
        req.flash('success', { msg: 'Te has unido a este encuentro.' });
        res.redirect('/event/' + eventId);
      });
    });
  })
};

exports.update = function (req, res) {
  var eventId = req.params.eventId;

  Event.findOne({ _id: eventId}, function(err, event) {
    if (err) return next(err);

    event.title = req.body.title;
    event.desc = req.body.desc;
    event.url = req.body.url;
    event.address = req.body.address;
    event.location = [req.body.longitude, req.body.latitude];
    event.date = moment(req.body.date, format);
    event.save(function (err, event) {
      req.flash('success', { msg: 'Encuentro actualizado.' });
      res.redirect('/event/' + event.id);
    });
  });
};

exports.getUpdate = function(req, res) {
  var eventId = req.params.eventId;
  Event.findOne({ _id: eventId}, function(err, event) {
    if (err || !event) return next(err);
    event.dateFormatted = moment(event.date).format(format)
    res.render('event/update', {
      event: event
    });
  });
};

exports.myEvent = function(req, res) {
  findEvent(createUserFilter(req.user)).exec(function(err, event) {
    if (err) return next(err);
    if (!event) {
      req.flash('warning', 'Aun no eres parte de un encuentro, únete o crea uno');
      return res.redirect('/event');
    }
    event.dateFormatted = moment(event.date).format(format)
    res.render('event/my-event', {
      event: event
    });
  })
};

function isPartOfEvent(user) {
  return Event.findOne(createUserFilter(user)).then(function(event) {
    return !!event
  })
}

function createUserFilter(user) {
  return {$or:[{moderator: user}, {participants: {$in: [user]}}]}
}

function findEvent(filter) {
  return Event.findOne(filter).populate('moderator').populate('participants');
}