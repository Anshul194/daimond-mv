import { loginAdmin } from '../../../controllers/adminController';
import dbConnect from '../../../lib/mongodb.js';

export async function POST(request) {
  try {
    await dbConnect();
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid JSON format. Ensure property names and string values use double quotes.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return await loginAdmin(body);
  } catch (err) {
    console.error('Route Error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}