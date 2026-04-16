import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

if (!process.env.MONGODB_URI) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const candidatePaths = [
      path.resolve(__dirname, '..', 'multi-tenant-teabox', '.env'),
      path.resolve(__dirname, '..', '.env'),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const t = line.trim();
          if (!t || t.startsWith('#')) continue;
          const eq = t.indexOf('=');
          if (eq === -1) continue;
          const key = t.slice(0, eq).trim();
          let val = t.slice(eq + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
          if (!process.env[key]) process.env[key] = val;
        }
        break;
      }
    }
  } catch (e) {}
}

async function run() {
  try {
    const dbModule = await import('../src/app/lib/mongodb.js');
    const dbConnect = dbModule.default || dbModule;
    await dbConnect();
    const ProductMod = await import('../src/app/models/Product.js');
    const Product = ProductMod.default || ProductMod;

    console.log('Before update:');
    const beforeTotal = await Product.countDocuments();
    const beforeMissing = await Product.countDocuments({ is_approved: { $exists: false } });
    console.log('  total ->', beforeTotal, 'missing is_approved ->', beforeMissing);

    const r1 = await Product.updateMany({ is_approved: { $exists: false } }, { $set: { is_approved: true } }, { strict: false });
    console.log('updateMany missing ->', r1.modifiedCount, r1.matchedCount);

    const r2 = await Product.updateMany({}, { $set: { is_approved: true, status: 'active' } }, { strict: false });
    console.log('updateMany all ->', r2.modifiedCount, r2.matchedCount);

    console.log('After update:');
    const afterMissing = await Product.countDocuments({ is_approved: { $exists: false } });
    const afterTrue = await Product.countDocuments({ is_approved: true });
    console.log('  missing is_approved ->', afterMissing, 'is_approved=true ->', afterTrue);

    process.exit(0);
  } catch (err) {
    console.error('Force update error:', err);
    process.exit(1);
  }
}

run();
