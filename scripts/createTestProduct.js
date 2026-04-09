// Usage:
// MONGODB_URI='mongodb://...' node scripts/createTestProduct.js
// or set MONGODB_URI in your environment and run: node scripts/createTestProduct.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set. Set it and rerun the script.');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Use the native driver collection insert to avoid model API differences
    const catRes = await mongoose.connection.collection('category').insertOne({ name: 'Test Category', slug: 'test-category-' + Date.now(), status: 'active', createdAt: new Date(), updatedAt: new Date() });
    const categoryId = catRes.insertedId;

    const prodRes = await mongoose.connection.collection('products').insertOne({
      name: 'Test Product for Attributes',
      slug: 'test-product-attr-' + Math.floor(Math.random() * 100000),
      category_id: categoryId,
      productType: 1,
      isInHouse: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const prodId = prodRes.insertedId;

    const invRes = await mongoose.connection.collection('productinventories').insertOne({ product: prodId, sku: `SKU-${prodId}`, stock_count: 10, stock_status: 'in_stock', manage_stock: 'yes', createdAt: new Date(), updatedAt: new Date() });
    const invId = invRes.insertedId;

    const detailRes = await mongoose.connection.collection('productinventorydetails').insertOne({ product_inventory_id: invId, product_id: prodId, color: 'Gold', size: null, sku: `ITEM-${invId}`, stock_count: 10, createdAt: new Date(), updatedAt: new Date() });
    const detailId = detailRes.insertedId;

    const attrRes = await mongoose.connection.collection('productinventorydetailattributes').insertOne({ product_id: prodId, inventory_details_id: detailId, attribute_name: 'Stone', attribute_value: 'Diamond', createdAt: new Date(), updatedAt: new Date() });
    const attrId = attrRes.insertedId;

    console.log('CATEGORY_ID=' + categoryId.toString());
    console.log('PRODUCT_ID=' + prodId.toString());
    console.log('INVENTORY_ID=' + invId.toString());
    console.log('DETAIL_ID=' + detailId.toString());
    console.log('ATTRIBUTE_ID=' + attrId.toString());

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exitCode = 1;
  }
}

run();
