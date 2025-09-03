import dbConnect from '../../../lib/mongodb.js';
import { updateUser } from '../../../controllers/userController.js';
import { parseFormData } from '../../../middlewares/uploadMiddleware.js';

export async function PUT(request, context) {
  try {
    await dbConnect();
    
    const { params } = await context;
    const userId = params.id;
    
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'User ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse form data (handles both text fields and files)
    const { fields, files } = await parseFormData(request);
    
    const updateData = {
      userId,
      ...fields,
      profilepic: files.profilepic || null
    };

    console.log('User update request:', { 
      userId, 
      fields: Object.keys(fields),
      hasProfilePic: !!files.profilepic 
    });

    return await updateUser(updateData);
  } catch (err) {
    console.error('User Update Route Error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Invalid request',
      error: err.message 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request, context) {
  try {
    await dbConnect();
    
    const { params } = await context;
    const userId = params.id;
    const userService = new (await import('../../../services/userService.js')).default();
    
    const user = await userService.getUserById(userId);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'User not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    

    // Remove password from response
    const { password, ...userWithoutPassword } = user._doc;

    return new Response(JSON.stringify({
      success: true,
      data: { user: userWithoutPassword },
      message: 'User retrieved successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Get User Error:', err);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
