import passport from "./passport.js";

export function googleLogin(req, res, next) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

export function loginSuccess(req, res) {
  console.log("LOGIN SUCCESS HANDLER");

  req.session.save(err => {
    if (err) {
      console.error(err);
      return next(err);
    }

    res.cookie("debugcookie", "hello", {
      secure: true,
      sameSite: "none",
      httpOnly: false
    });

    console.log("HEADERS NOW:", res.getHeaders());

    res.redirect(process.env.CLIENT_URL);
  });
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
  console.log("AUTH CHECK USER:", req.user);
  console.log("SESSION ID:", req.sessionID);
  console.log("SESSION:", req.session);

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