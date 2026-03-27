const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env for MONGODB_URI
const envPath = path.join(process.cwd(), '.env');
let MONGODB_URI = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match) MONGODB_URI = match[1].trim();
}

if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in .env");
    process.exit(1);
}

// Define inline schemas since we're running this standalone
const HomeStatSchema = new mongoose.Schema({
    label: String,
    value: Number,
    suffix: String,
    float: Boolean,
    order: Number,
    status: { type: String, default: 'active' }
});

const GreenBoxContentSchema = new mongoose.Schema({
    eyebrow: String,
    headlineLine1: String,
    headlineLine2: String,
    description: String,
    status: { type: String, default: 'active' }
});

const HomeStat = mongoose.models.HomeStat || mongoose.model('HomeStat', HomeStatSchema);
const GreenBoxContent = mongoose.models.GreenBoxContent || mongoose.model('GreenBoxContent', GreenBoxContentSchema);

const stats = [
    { label: 'Years of craft', value: 25, suffix: '+', float: false, order: 1 },
    { label: 'Bespoke pieces', value: 12000, suffix: '+', float: false, order: 2 },
    { label: 'Customer rating', value: 4.9, suffix: '★', float: true, order: 3 },
    { label: 'Countries served', value: 38, suffix: '+', float: false, order: 4 },
];

const content = {
    eyebrow: 'Est. Since',
    headlineLine1: 'Fine jewellery to feel good about,',
    headlineLine2: 'made to love for a lifetime.',
    description: 'Cullen sets the standard in fine jewellery with a commitment to premium craftsmanship. From our Australian workshop, our jewellers blend tradition and innovation, creating lasting pieces, responsibly.',
};

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        console.log("Clearing existing data...");
        await HomeStat.deleteMany({});
        await GreenBoxContent.deleteMany({});

        console.log("Seeding HomeStats...");
        await HomeStat.insertMany(stats);

        console.log("Seeding GreenBoxContent...");
        await GreenBoxContent.create(content);

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();
