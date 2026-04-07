import 'dotenv/config';

const args = process.argv.slice(2);
let uriArg = null;
let dryRun = false;
for (const a of args) {
  if (a.startsWith('--uri=')) uriArg = a.split('=')[1];
  if (a === '--dry') dryRun = true;
}
if (uriArg) process.env.MONGODB_URI = uriArg;

async function loadDeps() {
  const dbConnectMod = await import('../src/app/lib/mongodb.js');
  const ProductAttributeMod = await import('../src/app/models/productAttribute.js');
  const dbConnect = dbConnectMod.default || dbConnectMod;
  const ProductAttribute = ProductAttributeMod.default || ProductAttributeMod;
  return { dbConnect, ProductAttribute };
}

async function main() {
  try {
    const { dbConnect, ProductAttribute } = await loadDeps();
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not defined. Provide it in .env.local or pass --uri="<your uri>"');
      process.exit(1);
    }
    await dbConnect();

    const toRemove = await ProductAttribute.collection.find({ deletedAt: { $ne: null } }).toArray();
    console.log(`Found ${toRemove.length} documents with deletedAt != null.`);
    if (toRemove.length === 0) process.exit(0);

    if (dryRun) {
      for (const d of toRemove) console.log('Would delete:', d._id.toString(), d.title, d.deletedAt);
      console.log('Dry run complete. No documents deleted.');
      process.exit(0);
    }

    const ids = toRemove.map(d => d._id);
    const res = await ProductAttribute.collection.deleteMany({ _id: { $in: ids } });
    console.log(`Deleted ${res.deletedCount} documents from productattributes collection.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to prune attributes:', err);
    process.exit(1);
  }
}

main();
