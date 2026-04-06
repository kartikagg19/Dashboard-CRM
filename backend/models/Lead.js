const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    budget: { type: String },
    budgetN: { type: Number },
    bhk: { type: String },
    status: { type: String, default: 'New' },
    source: { type: String },
    stage: { type: String },
    contacted: { type: String, default: 'Just now' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
