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

function normalizeTitle(title) {
  if (!title) return '';
  // Trim and convert multiple spaces to single
  const s = title.trim().replace(/\s+/g, ' ');
  // Title Case
  return s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function main() {
  try {
    const { dbConnect, ProductAttribute } = await loadDeps();
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not defined. Provide it in .env.local or pass --uri="<your uri>"');
      process.exit(1);
    }
    await dbConnect();

    const raw = await ProductAttribute.collection.find({}).toArray();
    console.log(`Found ${raw.length} productAttribute documents (raw).`);

    // Group by normalized title + category
    const groups = new Map();
    for (const doc of raw) {
      const norm = normalizeTitle(doc.title || '');
      const cat = doc.category_id ? doc.category_id.toString() : 'null';
      const key = `${norm}::${cat}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(doc);
    }

    let mergedGroups = 0;
    let softDeleted = 0;
    for (const [key, docs] of groups.entries()) {
      if (docs.length <= 1) continue;
      mergedGroups++;
      // Sort to pick canonical: prefer active (deletedAt null) and earliest createdAt
      docs.sort((a, b) => {
        const aActive = !a.deletedAt ? 0 : 1;
        const bActive = !b.deletedAt ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        const ta = new Date(a.createdAt || 0).getTime();
        const tb = new Date(b.createdAt || 0).getTime();
        return ta - tb;
      });
      const canonical = docs[0];
      const others = docs.slice(1);

      // Collect unique terms
      const termSet = new Map();
      if (Array.isArray(canonical.terms)) {
        for (const t of canonical.terms) {
          const v = (t && t.value) ? String(t.value).trim() : '';
          if (v) termSet.set(v.toLowerCase(), { value: v, image: t.image || '' });
        }
      }
      for (const d of others) {
        if (Array.isArray(d.terms)) {
          for (const t of d.terms) {
            const v = (t && t.value) ? String(t.value).trim() : '';
            if (v && !termSet.has(v.toLowerCase())) {
              termSet.set(v.toLowerCase(), { value: v, image: t.image || '' });
            }
          }
        }
      }

      // Update canonical doc: normalized title and merged terms
      const mergedTerms = Array.from(termSet.values());
      const normalizedTitle = key.split('::')[0];

      await ProductAttribute.updateOne({ _id: canonical._id }, {
        $set: { title: normalizedTitle, terms: mergedTerms },
      });

      // Soft-delete other docs (set deletedAt if not set)
      for (const d of others) {
        if (!d.deletedAt) {
          await ProductAttribute.updateOne({ _id: d._id }, { $set: { deletedAt: new Date() } });
          softDeleted++;
        }
      }

      console.log(`Merged ${docs.length} docs into canonical _id=${canonical._id} title='${normalizedTitle}' terms=${mergedTerms.length}`);
    }

    console.log(`Processed ${groups.size} groups, merged ${mergedGroups} groups, soft-deleted ${softDeleted} documents.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to merge attributes:', err);
    process.exit(1);
  }
}

main();
