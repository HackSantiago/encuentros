var Promise = require('bluebird');
var mongoose = require('mongoose');

/*
 Event
 title string
 desc string
 moderator -> fb id
 list of attendees -> fb id
 dates
 */
var eventSchema = new mongoose.Schema({
  title: String,
  desc: String,
  url: String,
  moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
  location: Array
},
  {
    timestamps: true
  }
);

var Model = mongoose.model('Event', eventSchema);
module.exports = Event = Promise.promisifyAll(Model);
