import passport from "./passport.js";

export function googleLogin(req, res, next) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

export function googleCallback(req, res, next) {
  console.log("GOOGLE CALLBACK HIT");

  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth`,
  }, (err, user, info) => {

    console.log("PASSPORT CALLBACK RESULT");
    console.log("ERROR:", err);
    console.log("USER:", user);
    console.log("INFO:", info);

    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=auth`
      );
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log("LOGIN ERROR:", err);
        return next(err);
      }

      console.log("LOGIN SUCCESS USER:", req.user);
      console.log("SESSION BEFORE SAVE:", req.session);

      req.session.save((err) => {
        if (err) {
          console.log("SESSION SAVE ERROR:", err);
          return next(err);
        }

        console.log("SESSION SAVED:", req.session);

        res.redirect(process.env.CLIENT_URL);
      });
    });

  })(req, res, next);
}

export function loginSuccess(req, res) {
  console.log("LOGIN SUCCESS HANDLER");

  req.session.save((err) => {
    if (err) {
      console.error("SESSION SAVE ERROR:", err);
      return res.status(500).send("Session save failed");
    }

    console.log("SESSION FINAL:", req.session);
    console.log("SESSION ID AFTER SAVE:", req.sessionID);
    console.log("SET COOKIE HEADER:", res.getHeaders()["set-cookie"]);
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