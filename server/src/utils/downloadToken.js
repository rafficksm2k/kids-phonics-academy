import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function createDownloadToken({ orderId, productId, email }) {
  return jwt.sign({ orderId, productId, email, purpose: 'pdf-download' }, env.jwtSecret, {
    expiresIn: '7d'
  });
}

export function verifyDownloadToken(token) {
  const payload = jwt.verify(token, env.jwtSecret);
  if (payload.purpose !== 'pdf-download') {
    throw new Error('Invalid download token');
  }
  return payload;
}
