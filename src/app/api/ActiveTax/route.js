import dbConnect from '../../lib/mongodb.js';
import { getActiveTaxClassWithOptions } from '../../controllers/taxClassController.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const taxClass = await getActiveTaxClassWithOptions();
    return NextResponse.json(taxClass.body, { status: taxClass.status });
  }
  catch (err) {
    console.error('GET /tax-class/active error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  } 
  }
