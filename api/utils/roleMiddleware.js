import { errorHandler } from './error.js';

// Middleware to check if user has required role
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(errorHandler(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(errorHandler(403, `Access denied. This feature is only available for ${allowedRoles.join(' or ')} users.`));
    }

    next();
  };
};

// Specific middleware functions for common role checks
export const requireTenant = requireRole(['tenant']);
export const requireOwner = requireRole(['owner']);
export const requireAnyRole = requireRole(['tenant', 'owner']);
