// middleware/authorize.js
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.userType)) {
        return res.status(403).json({ error: "Forbidden: Access Denied" });
      }
      next();
    };
  };
  