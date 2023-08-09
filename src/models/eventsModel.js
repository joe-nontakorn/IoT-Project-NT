/*
Welcome to JP Learning
*/
const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const EventsSchema = new Schema({
  uuid: String,
  clientID: String,
  highPressure: Number,
  lowPressure: Number,
  airflow: Number,
  cooler: Number,
  watertemp: Number,
  waterflow: Number,
  waterpressure: Number,
  watt: Number,
  amp: Number,
  volt: Number,
  relay: String,
  createdAt: { 
    type: Date, 
    default: Date.now,
    get: function() {
      return this._createdAt.toString();
    }
  }
  
});

module.exports = mongoose.model('Events', EventsSchema);