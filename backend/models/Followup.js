const mongoose = require('mongoose');

const FollowupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    priority: { type: String, default: 'Medium' },
    type: { type: String, default: 'Call' },
    due: { type: String, default: 'Today' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Followup', FollowupSchema);
