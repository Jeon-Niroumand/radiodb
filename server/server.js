import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

import passport from './auth/passport.js';
import pool from './db/pool.js';

import authRoutes from './auth/authRoutes.js';
import radiosRouter from './routes/radios.js';
import sitesRouter from './routes/sites.js';
import usersRouter from './routes/users.js';
import rolesRouter from './routes/roles.js';

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

const app = express();

app.set("trust proxy", 1);

const PgSession = pgSession(session);

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
];

console.log("Allowed origins:", allowedOrigins);
console.log(
  "SESSION SECRET EXISTS:",
  !!process.env.SESSION_SECRET
);
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://radiodb.onrender.com"
  ],
  credentials: true,
}));

app.use(express.json());


/*
|--------------------------------------------------------------------------
| Session middleware
|--------------------------------------------------------------------------
*/

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      domain: ".onrender.com",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);


/*
|--------------------------------------------------------------------------
| Passport
|--------------------------------------------------------------------------
*/

app.use(passport.initialize());
app.use(passport.session());


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    status: "RadioDB API running",
  });
});

app.get("/auth-test", (req, res) => {
  res.json({
    message: "Auth area reachable",
    user: req.user || null,
  });
});
console.log("PROTOCOL:", req.protocol);
console.log("SECURE:", req.secure);
console.log("X-FORWARDED-PROTO:", req.headers["x-forwarded-proto"]);
app.use("/auth", authRoutes);

app.use("/radios", radiosRouter);
app.use("/sites", sitesRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);

/*
|--------------------------------------------------------------------------
| debug route
|--------------------------------------------------------------------------
*/

app.get("/cookie-test", (req,res)=> {
  res.cookie("testcookie","hello", {
    secure:true,
    sameSite:"none"
  });

  res.json({
    cookies:req.headers.cookie
  });
});

/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});