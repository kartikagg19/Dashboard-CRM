const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ── MongoDB Connection (with graceful fallback) ────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm_db';
let dbConnected = false;

// In-memory fallback data (used when MongoDB is unavailable)
let inMemoryLeads = [
    {
        _id: "1", name: "Amit Sharma", phone: "+91 98765 43210", email: "amit@gmail.com",
        budget: "₹5 Cr", budgetN: 5, bhk: "3 BHK", status: "Hot", source: "Facebook",
        stage: "New Lead", contacted: "Today, 9 AM", notes: "Interested in sea view unit",
        createdAt: new Date()
    },
    {
        _id: "2", name: "Rajeev Kulkarni", phone: "+91 97300 12345", email: "rajeev@gmail.com",
        budget: "₹5 Cr", budgetN: 5, bhk: "3 BHK", status: "Hot", source: "Walk-in",
        stage: "Qualified", contacted: "Yesterday", notes: "Ready to book if price negotiated",
        createdAt: new Date()
    },
    {
        _id: "3", name: "Anita Desai", phone: "+91 99876 54321", email: "anita@gmail.com",
        budget: "₹3.4 Cr", budgetN: 3.4, bhk: "2 BHK", status: "Warm", source: "Facebook",
        stage: "Interested", contacted: "5 days ago", notes: "Awaiting loan pre-approval",
        createdAt: new Date()
    },
    {
        _id: "4", name: "Vivek Menon", phone: "+91 98200 45678", email: "vivek@gmail.com",
        budget: "₹4.75 Cr", budgetN: 4.75, bhk: "3 BHK", status: "Hot", source: "Walk-in",
        stage: "Interested", contacted: "Today, 11 AM", notes: "Negotiating floor premium",
        createdAt: new Date()
    },
    {
        _id: "5", name: "Priya Nair", phone: "+91 91234 56789", email: "priya@gmail.com",
        budget: "₹3.3 Cr", budgetN: 3.3, bhk: "2 BHK", status: "Warm", source: "Website",
        stage: "New Lead", contacted: "3 days ago", notes: "Needs floor plan, no response",
        createdAt: new Date()
    },
    {
        _id: "6", name: "Deepak Verma", phone: "+91 88001 23456", email: "deepak@gmail.com",
        budget: "₹4.8 Cr", budgetN: 4.8, bhk: "3 BHK", status: "Cold", source: "Referral",
        stage: "Contacted", contacted: "8 days ago", notes: "Lost interest, try re-engage",
        createdAt: new Date()
    },
    {
        _id: "7", name: "Sunita Joshi", phone: "+91 77990 11223", email: "sunita@gmail.com",
        budget: "₹3.5 Cr", budgetN: 3.5, bhk: "2 BHK", status: "Warm", source: "Google Ads",
        stage: "Contacted", contacted: "4 days ago", notes: "Comparing with another project",
        createdAt: new Date()
    },
    {
        _id: "8", name: "Meera Shah", phone: "+91 80044 55667", email: "meera@gmail.com",
        budget: "₹3.2 Cr", budgetN: 3.2, bhk: "2 BHK", status: "New", source: "Broker",
        stage: "Qualified", contacted: "6 days ago", notes: "First-time buyer",
        createdAt: new Date()
    },
];

let nextId = 9;

// Attempt MongoDB connection (non-blocking)
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        dbConnected = true;
        console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
        dbConnected = false;
        console.warn('⚠️  MongoDB unavailable – running with in-memory data store');
        console.warn('   (Install MongoDB or set MONGO_URI to a MongoDB Atlas URI in .env)');
    });

// Lazy-load the Lead model only when DB is connected
// Lazy-load models
let Lead, Booking, SiteVisit, Followup, Task;
try {
    Lead = require('./models/Lead');
    Booking = require('./models/Booking');
    SiteVisit = require('./models/SiteVisit');
    Followup = require('./models/Followup');
    Task = require('./models/Task');
} catch (e) {
    console.error('Could not load models:', e.message);
}

// ── In-memory fallback data (additional entities) ───────────────────────
let inMemoryBookings = [
    { _id: "b1", name: "Suresh Iyer", phone: "+91 93001 11223", unit: "A-1204 | 3 BHK", floor: "12", amount: "₹5.00 Cr", date: "2026-03-20", status: "Agreement Signed", createdAt: new Date() }
];

let inMemoryVisits = [
    { _id: "v1", name: "Kiran Patil", phone: "+91 90000 78901", bhk: "3 BHK", date: "2026-03-26", time: "10:00 AM", agent: "Rohan Agarwal", status: "Scheduled", createdAt: new Date() }
];

let inMemoryFollowups = [
    { _id: "f1", name: "Priya Nair", phone: "+91 91234 56789", priority: "Urgent", type: "Call", due: "Today", notes: "No response for 3 days", createdAt: new Date() }
];

let inMemoryTasks = [
    { _id: "t1", name: "Call Vivek Menon – price negotiation", time: "10:30 AM", priority: "Urgent", done: false, createdAt: new Date() }
];

// ── API Routes ─────────────────────────────────────────────────────────────

// Helper for CRUD
const setupCrud = (name, model, memoryArray) => {
    // GET all
    app.get(`/api/${name}`, async (req, res) => {
        try {
            if (dbConnected && model) {
                const data = await model.find().sort({ createdAt: -1 });
                return res.json(data);
            }
            res.json([...memoryArray].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // POST new
    app.post(`/api/${name}`, async (req, res) => {
        try {
            if (dbConnected && model) {
                const newItem = new model(req.body);
                const saved = await newItem.save();
                return res.status(201).json(saved);
            }
            const newItem = { _id: String(nextId++), ...req.body, createdAt: new Date() };
            memoryArray.unshift(newItem);
            res.status(201).json(newItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // PUT update
    app.put(`/api/${name}/:id`, async (req, res) => {
        try {
            if (dbConnected && model) {
                const updated = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!updated) return res.status(404).json({ message: "Not found" });
                return res.json(updated);
            }
            const idx = memoryArray.findIndex(i => i._id === req.params.id);
            if (idx === -1) return res.status(404).json({ message: "Not found" });
            memoryArray[idx] = { ...memoryArray[idx], ...req.body };
            res.json(memoryArray[idx]);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // DELETE
    app.delete(`/api/${name}/:id`, async (req, res) => {
        try {
            if (dbConnected && model) {
                const deleted = await model.findByIdAndDelete(req.params.id);
                if (!deleted) return res.status(404).json({ message: "Not found" });
                return res.json({ message: "Deleted" });
            }
            const idx = memoryArray.findIndex(i => i._id === req.params.id);
            if (idx === -1) return res.status(404).json({ message: "Not found" });
            memoryArray.splice(idx, 1);
            res.json({ message: "Deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
};

setupCrud('leads', Lead, inMemoryLeads);
setupCrud('bookings', Booking, inMemoryBookings);
setupCrud('visits', SiteVisit, inMemoryVisits);
setupCrud('followups', Followup, inMemoryFollowups);
setupCrud('tasks', Task, inMemoryTasks);

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        database: dbConnected ? 'connected' : 'in-memory fallback',
        endpoints: ['/api/leads', '/api/bookings', '/api/visits', '/api/followups', '/api/tasks']
    });
});

// ── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});

