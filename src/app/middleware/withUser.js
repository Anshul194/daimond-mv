// src/app/middleware/withUser.js
// Middleware to extract user (admin/vendor/customer) from token and attach to request
import { verifyTokenAndUser, getUserFromToken } from '../middlewares/commonAuth.js';

export async function withUser(request, requiredRole = null) {
  let user = null;
  let error = null;
  try {
    const authResult = await verifyTokenAndUser(request, requiredRole);
    if (!authResult.error) {
      user = authResult.user;
    } else {
      // Fallback: try to decode token directly (bypass Redis) to recognize superadmin
      const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
      if (accessToken) {
        const fallbackUser = await getUserFromToken(accessToken);
        if (fallbackUser) {
          // If requiredRole is 'admin', ensure fallback user is admin/superadmin
          if (!requiredRole || requiredRole !== 'admin' || (fallbackUser.role && (fallbackUser.role === 'admin' || fallbackUser.role === 'superadmin'))) {
            user = fallbackUser;
          } else {
            error = authResult.error;
          }
        } else {
          error = authResult.error;
        }
      } else {
        error = authResult.error;
      }
    }
  } catch (e) {
    error = e;
  }
  return { user, error };
}
