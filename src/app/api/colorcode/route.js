import dbConnect from '../../lib/mongodb.js';
import {
  createColorCode,
  getColorCodes,
  getColorCodeById
} from '../../controllers/colorCodeController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';

// export async function POST(request) {
//   try {
//     await dbConnect();

//     // Verify admin access
//     const authResult = await verifyAdminAccess(request);
//     if (authResult.error) return authResult.error;

//     const { user: admin } = authResult;
//     const body = await request.json();

//     const data = {
//       name: body.name,
//       colorCode: body.colorCode,
//     };

//     const result = await createColorCode(data);
//     const status = typeof result.status === 'number' && result.status >= 200 && result.status <= 599 ? result.status : 500;
//     return NextResponse.json(result.body, { status });
//   } catch (err) {
//     console.error('POST /colorcode error:', err);
//     return NextResponse.json({ 
//       success: false, 
//       message: 'Invalid request',
//       error: err.message 
//     }, { status: 400 });
//   }
// }

export async function POST(request) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const result = await createColorCode(body); // Directly pass raw body

    return NextResponse.json(result.body, { status: result.status || 500 });
  } catch (err) {
    console.error('POST /colorcode error:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request', error: err.message },
      { status: 400 }
    );
  }
}


export async function GET(request) {
  try {
    await dbConnect();
    const query = Object.fromEntries(new URL(request.url).searchParams.entries());
    const result = query.id ? await getColorCodeById(query.id) : await getColorCodes(query);
    return NextResponse.json(result.body, { status: result.status || 500 });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}
