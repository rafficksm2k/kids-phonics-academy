import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: String(admin._id), username: admin.username, role: 'admin' },
    env.jwtSecret,
    { expiresIn: '8h' }
  );
}

export function requireAdminAuth(req, res, next) {
  const header = req.header('authorization') || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : '';
  const adminKey = req.header('x-admin-key') || '';

  if (bearer) {
    try {
      const payload = jwt.verify(bearer, env.jwtSecret);
      if (payload.role !== 'admin' || payload.purpose === 'pdf-download') {
        throw new Error('Not an admin token');
      }
      req.admin = payload;
      return next();
    } catch {
      return res.status(401).json({ message: 'Invalid or expired admin session' });
    }
  }

  if (env.adminApiKey && adminKey === env.adminApiKey) {
    req.admin = { username: 'api-key', role: 'admin' };
    return next();
  }

  return res.status(401).json({ message: 'Admin access required' });
}
