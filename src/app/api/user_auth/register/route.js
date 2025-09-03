import { registerUser } from '../../../controllers/userController.js';
import dbConnect from '../../../lib/mongodb.js';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    return await registerUser(body);
  } catch (err) {
    console.error('User Route Error:', err);
    return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
