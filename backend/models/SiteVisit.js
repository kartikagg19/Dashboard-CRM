const mongoose = require('mongoose');

const SiteVisitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    bhk: { type: String },
    date: { type: String },
    time: { type: String },
    agent: { type: String },
    status: { type: String, default: 'Scheduled' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteVisit', SiteVisitSchema);
