import { loginUser } from '../../../controllers/userController.js';
import dbConnect from '../../../lib/mongodb.js';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    return await loginUser(body);
  } catch (err) {
    console.error('Login Route Error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid login request' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
