import express from "express";
import passport from "./passport.js"
import {
  googleLogin,
  logout,
  currentUser,
} from "./authController.js";

const router = express.Router();

console.log("AUTH ROUTES LOADED");

router.get("/google", (req, res, next) => {
  console.log("GOOGLE LOGIN ROUTE HIT");
  googleLogin(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth`,
  }),
  (req, res, next) => {

    console.log("AUTH SUCCESS USER:", req.user);

    req.session.save(err => {
      if (err) {
        console.error("SESSION SAVE ERROR:", err);
        return next(err);
      }

      console.log("SESSION ID BEFORE REDIRECT:", req.sessionID);

      console.log(
        "SET COOKIE HEADER:",
        res.getHeader("Set-Cookie")
      );

      res.redirect(process.env.CLIENT_URL);
    });

  }
);

router.get("/me", (req, res) => {
  console.log("AUTH /me CHECK");
   console.log("REQ HEADERS COOKIE:", req.headers.cookie);
  console.log("SESSION ID:", req.sessionID);
  console.log("SESSION:", req.session);
  console.log("USER:", req.user);

  res.json({
    user: req.user || null,
  });
});

router.post("/logout", logout);

export default router;