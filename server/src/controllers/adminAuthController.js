import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser.js';
import { signAdminToken } from '../middleware/auth.js';

export async function login(req, res, next) {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await AdminUser.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = signAdminToken(admin);
    res.json({ token, username: admin.username });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ username: req.admin.username, role: 'admin' });
}
