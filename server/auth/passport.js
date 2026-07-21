import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import {
  getUserById,
  getUserByGoogleId,
  getUserByEmail,
  updateGoogleAccount,
  updateLastLogin,
  createGoogleUser,
} from "../models/userModel.js";

const VIEWER_ROLE_ID = 3; // Change if your Viewer role has a different ID.

console.log("Google OAuth config:", {
  clientID: process.env.GOOGLE_CLIENT_ID,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  hasSecret: !!process.env.GOOGLE_CLIENT_SECRET,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        // Only allow district accounts.
        if (!email || !email.endsWith("@scusd.edu")) {
          return done(null, false, {
            message: "Only SCUSD accounts are allowed.",
          });
        }

        // Try Google ID first.
        let user = await getUserByGoogleId(profile.id);

        if (user) {
          await updateLastLogin(
            user.id,
            profile.photos?.[0]?.value ?? null
          );

          return done(null, user);
        }

        // Existing user by email?
        user = await getUserByEmail(email);

        if (user) {
          user = await updateGoogleAccount(
            user.id,
            profile.id,
            profile.photos?.[0]?.value ?? null
          );

          return done(null, user);
        }

        // First login.
        user = await createGoogleUser(profile, VIEWER_ROLE_ID);

        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;