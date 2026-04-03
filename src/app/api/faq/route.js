import dbConnect from '../../lib/mongodb.js';
import {
  createFaq,
  getFaqs,
} from '../../controllers/faqController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';

export async function POST(request) {
  try {
    await dbConnect();
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

   const data = await request.json();
   const result = await createFaq(data);


    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    // console.error('POST /faq error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    // Connect to database first
    try {
      await dbConnect();
      // console.log('Database connected successfully for /faq');
    } catch (dbError) {
      // console.error('Database connection error in /faq:', dbError.message);
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed. Please check your MongoDB connection string and ensure MongoDB is running.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 503 }); // 503 Service Unavailable for connection issues
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    // console.log('GET /faq - Query params:', query);

    const result = await getFaqs(query);
    // console.log('GET /faq - Result:', { status: result.status });
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    // console.error('GET /faq error:', err);
    // console.error('GET /faq error stack:', err.stack);
    
    // Check if it's a database connection error
    if (err.message && (err.message.includes('ECONNREFUSED') || err.message.includes('MongoDB connection'))) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed. Please check your MongoDB connection.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      }, { status: 503 });
    }
    
    return NextResponse.json({ success: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}
