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

const InstagramReelSchema = new mongoose.Schema({
    image: String,
    reelUrl: String,
    order: Number,
    status: { type: String, default: 'active' }
});

const InstagramHeaderSchema = new mongoose.Schema({
    title: String,
    description: String
});

const InstagramReel = mongoose.models.InstagramReel || mongoose.model('InstagramReel', InstagramReelSchema);
const InstagramHeader = mongoose.models.InstagramHeader || mongoose.model('InstagramHeader', InstagramHeaderSchema);

const reels = [
    { image: "/images/home-slide-one/one.webp", reelUrl: "https://www.instagram.com/cullenjewellery/reel/DIxxgBsRSNc/", order: 1 },
    { image: "/images/home-slide-one/two.webp", reelUrl: "https://www.instagram.com/cullenjewellery/reel/DI2bo4CSDft/", order: 2 },
    { image: "/images/home-slide-one/three.jpg", reelUrl: "https://www.instagram.com/cullenjewellery/reel/DIxxgBsRSNc/", order: 3 },
    { image: "/images/home-slide-one/four.webp", reelUrl: "https://www.instagram.com/cullenjewellery/reel/DI2bo4CSDft/", order: 4 },
];

const header = {
    title: 'Instagram',
    description: 'Learn, engage and grow. Connect with Cullen for all things engagement, wedding and fine jewellery.'
};

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        console.log("Clearing existing Instagram data...");
        await InstagramReel.deleteMany({});
        await InstagramHeader.deleteMany({});

        console.log("Seeding Instagram reels...");
        await InstagramReel.insertMany(reels);

        console.log("Seeding Instagram header...");
        await InstagramHeader.create(header);

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();
