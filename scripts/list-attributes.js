import 'dotenv/config';

const args = process.argv.slice(2);
let uriArg = null;
for (const a of args) {
  if (a.startsWith('--uri=')) uriArg = a.split('=')[1];
  if (a.startsWith('--mongo=')) uriArg = a.split('=')[1];
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

    console.log('Querying raw collection (bypassing Mongoose hooks)...');
    const raw = await ProductAttribute.collection.find({}).toArray();
    console.log(`Found ${raw.length} documents (raw).`);
    for (const d of raw) {
      console.log('---');
      console.log('_id:', d._id?.toString());
      console.log('title:', d.title);
      console.log('category_id:', d.category_id?.toString() || null);
      console.log('deletedAt:', d.deletedAt || null);
      console.log('terms:', Array.isArray(d.terms) ? d.terms.map(t=>t.value).slice(0,20) : d.terms);
    }
    process.exit(0);
  } catch (err) {
    console.error('Failed to list attributes:', err);
    process.exit(1);
  }
}

main();
