// server/middleware/roleGuard.js
const roleGuard = (requiredRole) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
      }
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: `Forbidden: Requires ${requiredRole} role` });
      }
      next();
    };
  };
  
module.exports = roleGuard;
