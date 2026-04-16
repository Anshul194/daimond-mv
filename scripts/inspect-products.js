import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env if MONGODB_URI missing (same logic as migration)
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

    const total = await Product.countDocuments();
    const missing = await Product.countDocuments({ is_approved: { $exists: false } });
    const withFieldTrue = await Product.countDocuments({ is_approved: true });
    const withFieldFalse = await Product.countDocuments({ is_approved: false });

    console.log('Product totals:');
    console.log('  total ->', total);
    console.log('  missing is_approved ->', missing);
    console.log('  is_approved=true ->', withFieldTrue);
    console.log('  is_approved=false ->', withFieldFalse);

    const sample = await Product.findOne({}, { name:1, vendor:1, is_approved:1, status:1 }).lean();
    console.log('Sample product:', sample);

    process.exit(0);
  } catch (err) {
    console.error('Inspect error:', err);
    process.exit(1);
  }
}

run();
