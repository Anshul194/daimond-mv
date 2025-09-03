import jwt from 'jsonwebtoken';
import Admin from '../models/admin';

export async function getAdminFromRequest(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decoded.userId);
    return admin;
  } catch (err) {
    return null;
  }
}
