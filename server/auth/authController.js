import passport from "./passport.js";

export function googleLogin(req, res, next) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

export function googleCallback(req, res, next) {
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth`,
  })(req, res, next);
}

export function loginSuccess(req, res) {
  res.redirect(process.env.CLIENT_URL);
}

export function logout(req, res) {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ error: "Logout failed." });
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
}

export function currentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({
      authenticated: false,
    });
  }

  res.json({
    authenticated: true,
    user: req.user,
  });
}