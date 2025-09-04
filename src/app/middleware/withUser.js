// src/app/middleware/withUser.js
// Middleware to extract user (admin/vendor/customer) from token and attach to request
import { verifyTokenAndUser } from '../middlewares/commonAuth.js';

export async function withUser(request, requiredRole = null) {
  let user = null;
  let error = null;
  try {
    const authResult = await verifyTokenAndUser(request, requiredRole);
    if (!authResult.error) {
      user = authResult.user;
    } else {
      error = authResult.error;
    }
  } catch (e) {
    error = e;
  }
  return { user, error };
}
