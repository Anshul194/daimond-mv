import { logoutUser } from '../../../controllers/userController.js';
import dbConnect from '../../../lib/mongodb.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token is required' },
        { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];
    return await logoutUser(token);
  } catch (err) {
    console.error('Logout Route Error:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}