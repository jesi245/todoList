// models/Metric.js
const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  value: { type: Number, default: 0 }
});

module.exports = mongoose.model('Metric', metricSchema);
