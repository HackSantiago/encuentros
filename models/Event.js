var R = require('ramda');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var searchPlugin = require('mongoose-search-plugin');


var eventSchema = new mongoose.Schema({
  title:        String,
  desc:         String,
  url:          String,
  address:      String,
  tags:         { type: [String] , default: '' },
  moderator:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
  location: {
    type:  [Number],  // [<longitude>, <latitude>]
    index: '2d'       // create the  geospatial index
  }
}, {
  timestamps: true
});

eventSchema.plugin(searchPlugin, {
  fields: ['title', 'desc', 'tags', 'address']
});


eventSchema.statics.findByText = function(text) {
  if (!text) {
    return Event.findAsync({});
  }

  return Event.searchAsync(text)
  .then(function(events) {
    if (!events || !events.length) {
      return Event.findAsync({});
    }

    return events;
  });
};


eventSchema.statics.findByLocation = function(query) {
  var params = R.pick([
    'location', 'distance', 'limit'
  ], query);

  var location = params.location;
  var distance = parseFloat(params.distance);

  if (R.is(Object, location)) {
    location.lng = parseFloat(location.lng);
    location.lat = parseFloat(location.lat);
    location = [location.lng, location.lat]
  }

  // convert distance to radians, raduis of Earth is approximately 6371kms
  var maxDistance = (distance || 100) / 6371,
      limit = params.limit || 10;

  return Event.findAsync({
    location: {
      $near: location,
      $maxDistance: maxDistance
    }
  });
};


var Model = mongoose.model('Event', eventSchema);
module.exports = Event = Promise.promisifyAll(Model);
