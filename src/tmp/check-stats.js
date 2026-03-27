const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
let MONGODB_URI = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match) MONGODB_URI = match[1].trim();
}

const HomeStatSchema = new mongoose.Schema({
    label: String,
    value: Number
});

const HomeStat = mongoose.models.HomeStat || mongoose.model('HomeStat', HomeStatSchema);

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        const stats = await HomeStat.find({});
        console.log("Current Stats in DB:");
        stats.forEach(s => console.log(`ID: ${s._id} | Label: ${s.label}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
