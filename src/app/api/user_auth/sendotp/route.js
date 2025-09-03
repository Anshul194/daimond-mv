import { sendOTP } from '../../../controllers/userController.js';
import dbConnect from '../../../lib/mongodb.js';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    return await sendOTP(body);
  } catch (err) {
    console.error('Send OTP Route Error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}