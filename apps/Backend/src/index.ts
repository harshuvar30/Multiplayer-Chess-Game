import 'dotenv/config'
import express from 'express'
import { db } from './db'
import passport from 'passport';
import session from 'express-session';
import authRoutes from './auth/authRoutes';
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express()
app.use(express.json());
app.use(cookieParser())

app.use(session({
  secret: 'your-secret', // use a secure secret in production
  resave: false,
  saveUninitialized: false,
  cookie:{secure:false, maxAge: 60*60}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: "http://localhost:5173", // Allow requests from your frontend
  credentials: true,              // Allow sending cookies (important for auth)
}));

app.use('/api/auth', authRoutes);

// app.post('/auth',async(req,res)=>{
//     console.log("checking body data", req.body)
//     try{
//         await db.user.create({
//          data: {
//       username: req.body.email,
//       email: req.body.email,
//       name: req.body.name,
//       provider: 'GUEST',
//     },
//     })
//     res.status(200).send({message:'post reuest was saxxx'})
// }catch(err){
//     res.status(500).send({message:'chud gaye guru', error:err})
// }
// })

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});