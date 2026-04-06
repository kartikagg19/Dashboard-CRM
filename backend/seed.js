const mongoose = require('mongoose');
const Lead = require('./models/Lead');
require('dotenv').config();

const initialLeads = [
    {
        name: "Amit Sharma",
        phone: "+91 98765 43210",
        email: "amit@gmail.com",
        budget: "₹5 Cr",
        budgetN: 5,
        bhk: "3 BHK",
        status: "Hot",
        source: "Facebook",
        stage: "New Lead",
        contacted: "Today, 9 AM",
        notes: "Interested in sea view unit",
    },
    {
        name: "Rajeev Kulkarni",
        phone: "+91 97300 12345",
        email: "rajeev@gmail.com",
        budget: "₹5 Cr",
        budgetN: 5,
        bhk: "3 BHK",
        status: "Hot",
        source: "Walk-in",
        stage: "Qualified",
        contacted: "Yesterday",
        notes: "Ready to book if price negotiated",
    },
    {
        name: "Anita Desai",
        phone: "+91 99876 54321",
        email: "anita@gmail.com",
        budget: "₹3.4 Cr",
        budgetN: 3.4,
        bhk: "2 BHK",
        status: "Warm",
        source: "Facebook",
        stage: "Interested",
        contacted: "5 days ago",
        notes: "Awaiting loan pre-approval",
    },
    {
        name: "Vivek Menon",
        phone: "+91 98200 45678",
        email: "vivek@gmail.com",
        budget: "₹4.75 Cr",
        budgetN: 4.75,
        bhk: "3 BHK",
        status: "Hot",
        source: "Walk-in",
        stage: "Interested",
        contacted: "Today, 11 AM",
        notes: "Negotiating floor premium",
    },
    {
        name: "Priya Nair",
        phone: "+91 91234 56789",
        email: "priya@gmail.com",
        budget: "₹3.3 Cr",
        budgetN: 3.3,
        bhk: "2 BHK",
        status: "Warm",
        source: "Website",
        stage: "New Lead",
        contacted: "3 days ago",
        notes: "Needs floor plan, no response",
    },
    {
        name: "Deepak Verma",
        phone: "+91 88001 23456",
        email: "deepak@gmail.com",
        budget: "₹4.8 Cr",
        budgetN: 4.8,
        bhk: "3 BHK",
        status: "Cold",
        source: "Referral",
        stage: "Contacted",
        contacted: "8 days ago",
        notes: "Lost interest, try re-engage",
    },
    {
        name: "Sunita Joshi",
        phone: "+91 77990 11223",
        email: "sunita@gmail.com",
        budget: "₹3.5 Cr",
        budgetN: 3.5,
        bhk: "2 BHK",
        status: "Warm",
        source: "Google Ads",
        stage: "Contacted",
        contacted: "4 days ago",
        notes: "Comparing with another project",
    },
    {
        name: "Meera Shah",
        phone: "+91 80044 55667",
        email: "meera@gmail.com",
        budget: "₹3.2 Cr",
        budgetN: 3.2,
        bhk: "2 BHK",
        status: "New",
        source: "Broker",
        stage: "Qualified",
        contacted: "6 days ago",
        notes: "First-time buyer",
    },
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");
        
        // Only seed if empty
        const count = await Lead.countDocuments();
        if (count === 0) {
            await Lead.insertMany(initialLeads);
            console.log("Database seeded with initial leads.");
        } else {
            console.log("Database already has data. Skipping seed.");
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Seeding error:", error);
    }
}

seedDB();
