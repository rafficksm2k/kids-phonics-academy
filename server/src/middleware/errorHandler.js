import { env } from '../config/env.js';

export function requireAdmin(req, res, next) {
  const key = req.header('x-admin-key') || '';
  if (!env.adminApiKey || key !== env.adminApiKey) {
    return res.status(401).json({ message: 'Admin access required' });
  }
  return next();
}

export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
}
