import dbConnect from '../../lib/mongodb.js';
import {
  createProductAttribute,
  getProductAttributes,
  getProductAttributeById,
  updateProductAttribute,
  deleteProductAttribute
} from '../../controllers/productAttributeController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess ,verifyTokenAndUser} from '../../middlewares/commonAuth.js';
// import  verifyAdminAccess  from '../../middlewares/commonAuth.js';
import {parseNestedFormData} from '../../utils/parseNestedFormData.js';

// GET - Fetch all attributes or single by ID
export async function GET(request) {
  try {
    // Connect to database first
    try {
      await dbConnect();
      console.log('Database connected successfully for /productattribute');
    } catch (dbError) {
      console.error('Database connection error in /productattribute:', dbError.message);
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed. Please check your MongoDB connection string and ensure MongoDB is running.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 503 }); // 503 Service Unavailable for connection issues
    }

    let admin = null;
    let authResult = null;
    // Try to get token, but don't require it
     try {
         authResult = await verifyTokenAndUser(request, 'admin');
         if (!authResult.error) admin = authResult.user;
       } catch (e) {
        console?.log('No admin authentication, proceeding as public',e?.message);
         // Ignore auth errors for public access
         admin = null;
       }

    // Extract query params from NextRequest
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const id = searchParams.get('id');
    
    // Handle filters parameter - if it's a JSON string, keep it as is; otherwise stringify it
    if (query.filters && typeof query.filters === 'string') {
      // Already a JSON string, keep it
      try {
        // Validate it's valid JSON
        JSON.parse(query.filters);
      } catch (e) {
        // If not valid JSON, wrap it in quotes to make it a string value
        query.filters = JSON.stringify({ title: query.filters });
      }
    } else if (query.filters && typeof query.filters === 'object') {
      // If it's an object, stringify it
      query.filters = JSON.stringify(query.filters);
    } else if (!query.filters) {
      // If filters is not provided, set default empty object
      query.filters = '{}';
    }

    console?.log('[DEBUG] Incoming query params:', query);
    console?.log('[DEBUG] Parsed filters:', query.filters);
    console?.log('[DEBUG] Admin info:', admin);

    const result = id ? await getProductAttributeById(id) : await getProductAttributes(query, admin);
    console.log('GET /productattribute - Result:', { status: result.status });
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('GET /product-attributes error:', err);
    console.error('GET /product-attributes error stack:', err.stack);
    
    // Check if it's a database connection error
    if (err.message && (err.message.includes('ECONNREFUSED') || err.message.includes('MongoDB connection'))) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed. Please check your MongoDB connection.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      }, { status: 503 });
    }
    
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}





export async function POST(request) {
  try {
    await dbConnect();

    const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;

    const form = await request.formData();
    const result = await createProductAttribute(form, authResult.user);

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('POST /subcategory error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}



// PUT - Update attribute
export async function PUT(request) {
  try {
    await dbConnect();
     const authResult = await verifyAdminAccess(request);
    if (authResult.error) return authResult.error;
    console.log('Admin access verified', authResult);

    const { user: admin } = authResult;
    console.log('Admin authenticated:', admin);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID parameter is required' },
        { status: 400 }
      );
    }

    const contentType = request.headers.get('content-type');
    let data = {};

    // Handle both JSON and FormData
    if (contentType?.includes('application/json')) {
      data = await request.json();
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = parseNestedFormData(formData);
      console.log('Parsed form data for update:', data);
    } else {
      return NextResponse.json(
        { success: false, message: 'Unsupported content type. Use application/json or multipart/form-data' },
        { status: 415 }
      );
    }
    
    // Add metadata
    data.lastModifiedBy = {
     
      id: admin?.id?.toString() || 'admin-id', // Replace with actual admin ID from auth
      email: admin.email,
      name: admin.name,
      timestamp: new Date()
    };

    const result = await updateProductAttribute(id, data);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('PUT /product-attributes error:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request data' },
      { status: 400 }
    );
  }
}

// DELETE - Soft delete attribute
export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID parameter is required' },
        { status: 400 }
      );
    }

    const result = await deleteProductAttribute(id);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('DELETE /product-attributes error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}