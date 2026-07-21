import 'dotenv/config';
import session from 'express-session';
import passport from './auth/passport.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './auth/authRoutes.js';
import radiosRouter from './routes/radios.js';
import sitesRouter from './routes/sites.js';
import usersRouter from './routes/users.js';
import rolesRouter from './routes/roles.js';

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

const app = express();
app.set("trust proxy", 1); // Required when running behind Render's proxy

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
];

app.get("/", (req, res) => {
  res.json({
    status: "RadioDB API running",
  });
});

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin (e.g. curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.use('/radios', radiosRouter);
app.use('/sites', sitesRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);

const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});