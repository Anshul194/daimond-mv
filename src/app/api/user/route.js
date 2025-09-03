import { getUserProfile } from '../../controllers/userController.js';
import dbConnect from '../../lib/mongodb.js';

export async function GET(request) {
  try {
    await dbConnect();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Authorization token is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const token = authHeader.split(' ')[1];
    return await getUserProfile(token);
  } catch (err) {
    console.error('User Profile Route Error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}