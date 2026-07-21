export default function authenticate(req, res, next) {
  console.log("AUTH CHECK:", req.user);

  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  next();
}