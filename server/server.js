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
  origin(origin, callback) {
    console.log("CORS request origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
    name: "radiodb.sid",

    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    proxy: true,

    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
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

app.use((req, res, next) => {
  console.log("---- REQUEST DEBUG ----");
  console.log("URL:", req.originalUrl);
  console.log("COOKIE:", req.headers.cookie);
  console.log("SESSION ID:", req.sessionID);
  console.log("USER:", req.user);
  next();
});

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

app.use((req, res, next) => {
  console.log("SESSION DEBUG");
  console.log("ID:", req.sessionID);
  console.log("USER:", req.user);
  console.log("COOKIE HEADER:", req.headers.cookie);
  next();
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