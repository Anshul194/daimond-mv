import {registerAdmin } from '../../../controllers/adminController';
import dbConnect from '../../../lib/mongodb.js'

export async function POST(request) {
  try {
    dbConnect();
    const body = await request.json();
    return await registerAdmin(body);
  } catch (err) {
    console.error('Route Error:', err);
    return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}




