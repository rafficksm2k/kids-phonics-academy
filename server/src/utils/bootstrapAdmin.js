import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser.js';
import { env } from '../config/env.js';

export async function bootstrapAdmin() {
  const username = env.adminUsername;
  const existing = await AdminUser.findOne({ username });
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await AdminUser.create({ username, passwordHash });
  console.log(`Admin user created: ${username}`);
}
