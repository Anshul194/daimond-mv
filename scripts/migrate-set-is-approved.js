/*
  Script: migrate-set-is-approved.js
  Purpose: Set `is_approved: true` on existing Product documents that are missing the field.
  Usage: node scripts/migrate-set-is-approved.js
*/

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// If MONGODB_URI is not set, try to load from nearby .env (multi-tenant-teabox/.env)
if (!process.env.MONGODB_URI) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Look for sibling folder ../multi-tenant-teabox/.env or ../.env
    const candidatePaths = [
      path.resolve(__dirname, '..', '..', 'multi-tenant-teabox', '.env'),
      path.resolve(__dirname, '..', '.env'),
    ];
    console.log('Looking for .env in candidates:', candidatePaths);
    for (const p of candidatePaths) {
      const exists = fs.existsSync(p);
      console.log('  candidate', p, 'exists=', exists);
      if (exists) {
        const content = fs.readFileSync(p, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eq = trimmed.indexOf('=');
          if (eq === -1) continue;
          const key = trimmed.slice(0, eq).trim();
          let val = trimmed.slice(eq + 1).trim();
          // Remove surrounding quotes
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
        console.log('Loaded .env from', p);
        break;
      }
    }
    console.log('MONGODB_URI after loading env:', !!process.env.MONGODB_URI);
  } catch (e) {
    // ignore
  }
}

async function run() {
  try {
    // Import dbConnect after loading env to avoid premature error
    const dbModule = await import('../src/app/lib/mongodb.js');
    const dbConnect = dbModule.default || dbModule;
    await dbConnect();
    const ProductMod = await import('../src/app/models/Product.js');
    const Product = ProductMod.default || ProductMod;

    // Update products where is_approved is missing (undefined)
    const res1 = await Product.updateMany(
      { is_approved: { $exists: false } },
      { $set: { is_approved: true } }
    );

    // ALSO: set is_approved=true for ALL existing products and activate them
    const resAll = await Product.updateMany(
      { },
      { $set: { is_approved: true, status: 'active' } }
    );

    // Optionally, ensure products with vendor set remain unapproved until admin reviews
    const res2 = await Product.updateMany(
      { is_approved: { $exists: true }, vendor: { $ne: null }, is_approved: true },
      { $set: { is_approved: false, status: 'inactive' } }
    );

    console.log('Updated missing is_approved ->', res1.modifiedCount, 'documents');
    console.log('Set is_approved=true for ALL products ->', resAll.modifiedCount, 'documents');
    console.log('Marked vendor products as unapproved ->', res2.modifiedCount, 'documents');

    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();
