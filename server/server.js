import 'dotenv/config';

import express from "express";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";

import passport from "./auth/passport.js";
import pool from "./db/pool.js";

import authRoutes from "./auth/authRoutes.js";
import radiosRouter from "./routes/radios.js";
import sitesRouter from "./routes/sites.js";
import usersRouter from "./routes/users.js";
import rolesRouter from "./routes/roles.js";


const app = express();

app.set("trust proxy", 1);


const PgSession = pgSession(session);


const allowedOrigins = [
  "http://localhost:3000",
  "https://radiodb.onrender.com"
];


app.use(
 session({

   name:"radiodb.sid",

   store:new PgSession({
      pool,
      tableName:"session",
      createTableIfMissing:true
   }),

   secret:process.env.SESSION_SECRET,

   resave:false,

   saveUninitialized:false,

   rolling:true,

   proxy:true,


   cookie:{

     httpOnly:true,

     secure:true,

     sameSite:"none",

     maxAge:7 * 24 * 60 * 60 * 1000

   }

 })
);

app.use((req,res,next)=>{
  res.on("finish",()=>{
    console.log(
      "FINAL SET COOKIE:",
      res.getHeader("set-cookie")
    );
  });

  next();
});

app.use(cors({
  origin: function(origin, callback){

    console.log("CORS:", origin);

    if(!origin || allowedOrigins.includes(origin)){
      callback(null,true);
    } else {
      callback(new Error("CORS blocked"));
    }

  },

  credentials:true
}));



app.use(express.json());

app.use(passport.initialize());

app.use(passport.session());



app.use((req,res,next)=>{

 console.log("REQUEST DEBUG");
 console.log(req.method, req.originalUrl);
 console.log("COOKIE:",req.headers.cookie);
 console.log("SESSION:",req.sessionID);
 console.log("USER:",req.user);

 next();

});



app.get("/",(req,res)=>{
 res.json({
   status:"RadioDB API running"
 });
});



app.use("/auth",authRoutes);

app.use("/radios",radiosRouter);

app.use("/sites",sitesRouter);

app.use("/users",usersRouter);

app.use("/roles",rolesRouter);



const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

 console.log(
 `Server running on ${PORT}`
 );

});