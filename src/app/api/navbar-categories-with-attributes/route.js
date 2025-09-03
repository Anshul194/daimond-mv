// app/api/navbar-categories-with-attributes/route.js

import dbConnect from '../../lib/mongodb.js';
import { getNavbarCategoriesWithAttributes } from '../../controllers/categoryController.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const result = await getNavbarCategoriesWithAttributes();
  return NextResponse.json(result.body, { status: result.status });
}
