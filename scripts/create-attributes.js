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

async function upsertAttribute(ProductAttribute, title, terms = [], categoryId = null) {
  const existing = await ProductAttribute.findOne({ title });
  if (existing) {
    const existingValues = new Set((existing.terms || []).map(t => (t.value || '').toString().toLowerCase()));
    const newTerms = [];
    for (const t of terms) {
      if (!existingValues.has((t.value || '').toString().toLowerCase())) newTerms.push(t);
    }
    if (newTerms.length > 0) {
      existing.terms = [...(existing.terms || []), ...newTerms];
      if (categoryId) existing.category_id = categoryId;
      await existing.save();
      console.log(`Updated attribute '${title}' with ${newTerms.length} new terms.`);
    } else {
      console.log(`Attribute '${title}' already has all terms.`);
    }
    return existing;
  }

  const doc = new ProductAttribute({
    title,
    category_id: categoryId || null,
    terms: terms.map(t => ({ value: t.value, image: t.image || '' })),
  });
  await doc.save();
  console.log(`Created attribute '${title}' with ${terms.length} terms.`);
  return doc;
}

async function main() {
  try {
    const { dbConnect, ProductAttribute } = await loadDeps();

    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not defined. Provide it in .env.local or pass --uri="<your uri>"');
      process.exit(1);
    }

    await dbConnect();

    // Define attributes and terms
    const attributes = [
      {
        title: 'Shape',
        terms: [
          'Round','Oval','Emerald','Radiant','Pear','Cushion','Elongated Cushion','Elongated Hexagon','Marquise','Heart','Princess','Asscher'
        ].map(v => ({ value: v }))
      },
      {
        title: 'METAL TYPE',
        terms: ['Platinum','18k White Gold','18k Rose Gold','18k Yellow Gold','White Gold','Yellow Gold','Rose Gold'].map(v=>({value:v}))
      },
      {
        title: 'Style',
        terms: ['Trilogy','Solitaire','Halo','Toi et Moi','Bezel','East West','Pavé','Plain','Accents'].map(v=>({value:v}))
      },
      {
        title: 'BAND TYPE',
        terms: ['Plain','Pavé','Accents','Channel','Milgrain','Split Shank'].map(v=>({value:v}))
      },
      {
        title: 'SETTING',
        terms: ['Trilogy','Solitaire','Halo','Toi et Moi','Bezel','East West','East West (Horizontal)','Tension'].map(v=>({value:v}))
      }
      ,
      {
        title: 'SETTING PROFILE',
        terms: ['High Set','Low Set','Flush','V-Style'].map(v=>({value:v}))
      },
      {
        title: 'TWO TONE',
        terms: ['Yes','No'].map(v=>({value:v}))
      },
      {
        title: 'GENDER',
        terms: ['Woman','Man','Unisex'].map(v=>({value:v}))
      }
    ];

    for (const attr of attributes) {
      await upsertAttribute(ProductAttribute, attr.title, attr.terms);
    }

    console.log('All attributes upserted.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create attributes:', err);
    process.exit(1);
  }
}

main();
