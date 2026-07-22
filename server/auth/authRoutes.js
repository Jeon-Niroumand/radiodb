import express from "express";
import passport from "./passport.js";

import {
  googleLogin,
  loginSuccess,
  logout,
  currentUser,
} from "./authController.js";

const router = express.Router();

console.log("AUTH ROUTES LOADED");

router.get("/google", googleLogin);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth`,
  }),
  loginSuccess
);

router.get("/me", currentUser);

router.post("/logout", logout);

export default router;