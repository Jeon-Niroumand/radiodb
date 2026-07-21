import express from "express";

import {
  googleLogin,
  googleCallback,
  loginSuccess,
  logout,
  currentUser,
} from "./authController.js";

const router = express.Router();

router.get("/google", googleLogin);

router.get(
  "/google/callback",
  googleCallback,
  loginSuccess
);

router.get("/me", currentUser);

router.post("/logout", logout);

export default router;