var R = require('ramda');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var searchPlugin = require('mongoose-search-plugin');


var eventSchema = new mongoose.Schema({
  title:        String,
  desc:         String,
  url:          String,
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
  fields: ['title', 'desc', 'tags']
});


eventSchema.statics.findByText = function(text) {
  if (!text) {
    return Event.find({});
  }

  return Event.search(text);
};


eventSchema.statics.findNear = function(query) {
  var params = R.pick([
    'location', 'distance', 'limit'
  ], query);

  // we need to convert the distance to radians
  // the raduis of Earth is approximately 6371 kilometers
  var maxDistance = params.distance / 6371;

  // find a location
  return Event.findAsync({
    location: {
      $near: params.coords,
      $maxDistance: maxDistance
    }
  });
};


var Model = mongoose.model('Event', eventSchema);
module.exports = Event = Promise.promisifyAll(Model);
