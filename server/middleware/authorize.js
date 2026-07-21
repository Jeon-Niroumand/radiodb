export default function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role_name)) {
      return res.status(403).json({
        error: "Insufficient permissions",
      });
    }

    next();
  };
}