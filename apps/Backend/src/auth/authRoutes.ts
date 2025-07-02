import express, { Request, Response } from 'express'
import passport from 'passport'
import '../auth/googleStrategy'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4  } from 'uuid';
import { db } from '../db';
import { error } from 'console';

const router = express.Router();
const JWT_SECRET = 'your-secret'
const COOKIE_MAX_AGE = 60*60
interface userJwtClaims {
  userId: string;
  name: string;
  isGuest?: boolean;
}

interface UserDetails {
  id: string;
  token?: string;
  name: string;
  isGuest?: boolean;
}
router.post('/guest', async (req:Request,res:Response)=>{
  const bodyData = req.body;
  let guestUUID = 'guest-' + uuidv4()

  const user = await db.user.create({
    data:{
        username: guestUUID,
        email: guestUUID + '@guest-user.com',
        name: bodyData.name || guestUUID,
        provider: 'GUEST'
    }
  })

const token = jwt.sign(
    { userId: user.id, name: user.name, isGuest: true },
    JWT_SECRET,
  );
   const UserDetails: UserDetails = {
    id: user.id,
    name: user.name!,
    token: token,
    isGuest: true,
  };
  res.cookie('guest', token, { maxAge: COOKIE_MAX_AGE });
  res.json(UserDetails);
})
router.get('/google',
    passport.authenticate('google',{scope:['profile','email']})
)

router.get('/google/callback',
    passport.authenticate('google', { 
    successRedirect: 'http://localhost:5173/game',
    failureRedirect: '/api/auth/failure'
     }),
)

router.get('/protected',(req,res) =>{
    if(req.isAuthenticated()){
        res.send(`Welcom ${req.user}`)
    }else{
        res.status(401).send('Unauthorized')
    }
})


router.get('/failure',(req,res)=>{
   res.status(401).json({ success: false, message: 'failure' });
})

router.get('/logout',(req,res)=>{
    res.clearCookie('guest')
    req.logout((err)=>{
      if(err){
        console.log("Error while loggin out user : ", err)
        res.status(500).send({error:'Error while loggin out user'})
      }
      else{
        res.clearCookie('jwt')
        console.log("logout complet returning to home page")
        res.redirect('http://localhost:5173')
      }
    })
})
router.get('/refresh', async (req : Request, res: any) => {
  const token = req.cookies.guest;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as userJwtClaims;
    const user = await db.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userDetails: UserDetails = {
      id: user.id,
      name: user.name!,
      isGuest: decoded.isGuest,
    };
    res.json(userDetails);
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

export default router;