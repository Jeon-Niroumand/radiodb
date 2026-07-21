import express from "express";

import {
  googleLogin,
  googleCallback,
  loginSuccess,
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
  googleCallback,
  loginSuccess
);

router.get("/me", currentUser);

router.post("/logout", logout);

export default router;