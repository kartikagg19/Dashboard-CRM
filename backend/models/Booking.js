const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    unit: { type: String },
    floor: { type: String },
    amount: { type: String },
    date: { type: String },
    status: { type: String, default: 'Token Paid' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
