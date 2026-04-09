// Usage:
// MONGODB_URI='mongodb://...' node scripts/checkProduct.js <PRODUCT_ID>
// or set MONGODB_URI in env and run: node scripts/checkProduct.js <PRODUCT_ID>

const mongoose = require('mongoose');
const util = require('util');

const PRODUCT_ID = process.argv[2];
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!PRODUCT_ID) {
  console.error('Usage: node scripts/checkProduct.js <PRODUCT_ID>');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment. Either set MONGODB_URI or pass it inline.');
  process.exit(2);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
    const ProductInventory = mongoose.model('ProductInventory', new mongoose.Schema({}, { strict: false }), 'productinventories');
    const ProductInventoryDetail = mongoose.model('ProductInventoryDetail', new mongoose.Schema({}, { strict: false }), 'productinventorydetails');
    const ProductInventoryDetailAttribute = mongoose.model('ProductInventoryDetailAttribute', new mongoose.Schema({}, { strict: false }), 'productinventorydetailattributes');

    const id = PRODUCT_ID;

    const product = await Product.findOne({ _id: id }).lean();
    console.log('Product:', product ? util.inspect(product, { depth: 2 }) : null);

    const inventory = await ProductInventory.findOne({ product: id }).lean();
    console.log('Inventory:', inventory ? util.inspect(inventory, { depth: 2 }) : null);

    if (inventory && inventory._id) {
      const details = await ProductInventoryDetail.find({ product_inventory_id: inventory._id }).lean();
      console.log('Inventory Details count:', details.length);
      details.forEach(d => console.log(' - Detail:', util.inspect(d, { depth: 1 })));

      const detailIds = details.map(d => d._id);
      if (detailIds.length > 0) {
        const attrs = await ProductInventoryDetailAttribute.find({ inventory_details_id: { $in: detailIds } }).lean();
        console.log('Attributes count:', attrs.length);
        attrs.forEach(a => console.log(' - Attr:', util.inspect(a, { depth: 1 })));
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    process.exitCode = 1;
    try { await mongoose.disconnect(); } catch (e) {}
  }
}

run();
