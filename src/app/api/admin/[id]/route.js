
import { getUserById } from '../../../controllers/adminController.js';
import { getAdminFromRequest } from '../../../utils/adminAuth.js';

export async function GET(request, context) {
  const { params } = await context;
  const { id } = params;
  const currentAdmin = await getAdminFromRequest(request);
  if (!currentAdmin) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Vendors can only fetch their own data
  if (currentAdmin.role === 'vendor' && currentAdmin._id.toString() !== id) {
    return new Response(JSON.stringify({ success: false, message: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Superadmins can fetch any admin
  return getUserById(id);
}

