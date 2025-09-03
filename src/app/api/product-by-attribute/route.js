import dbConnect from '../../lib/mongodb.js';
import {
  getProductsByAttribute,
} from '../../controllers/productController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';



export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await getProductsByAttribute(query);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /product error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
