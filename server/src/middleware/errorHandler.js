import { env } from '../config/env.js';

export function requireAdmin(req, res, next) {
  const key = req.header('x-admin-key') || '';
  if (!env.adminApiKey || key !== env.adminApiKey) {
    console.warn('[401] Admin access required', {
      file: 'server/src/middleware/errorHandler.js:requireAdmin',
      path: req.originalUrl
    });
    return res.status(401).json({
      message: 'Admin access required',
      ...(env.isDev
        ? { details: { file: 'server/src/middleware/errorHandler.js', fn: 'requireAdmin', path: req.originalUrl } }
        : {})
    });
  }
  return next();
}

export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  console.error('[errorHandler]', {
    path: req.originalUrl,
    method: req.method,
    status: err.status || 500,
    message: err.message,
    stack: env.isDev ? err.stack : undefined
  });
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(env.isDev
      ? {
          details: err.details || null,
          stack: err.stack
        }
      : {})
  });
}
