import express, { Request, Response } from 'express'
import passport from 'passport'
import '../auth/googleStrategy'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4  } from 'uuid';
import { db } from '../db';
import { error } from 'console';

const router = express.Router();
const JWT_SECRET = 'your_secret_key'
const COOKIE_MAX_AGE = 24*60*60*1000
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
  console.log('checking user details', UserDetails)
  console.log('checking cookie age', COOKIE_MAX_AGE)
  res.cookie('guest', token, 
    {
  maxAge: COOKIE_MAX_AGE,
  domain: 'localhost',
  httpOnly: true, 
  sameSite: 'lax',   // Use 'lax' for dev (less restrictive)
  secure: false  
   });
  res.json(UserDetails);
})

router.get('/google',
    passport.authenticate('google',{scope:['profile','email']})
)

router.get('/google/callback',
    passport.authenticate('google', { 
    successRedirect: 'http://localhost:5173/game',
    failureRedirect: '/failure'
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
    console.log("inside refresh route and checking if cookies exits or not ?", req.user, req.cookies)
    console.log("inside refresh route and checking if cookies exits or not ?",  req.cookies)
    console.log("checking req.cookies.guest", req?.cookies?.guest)
   if (req.user) {
    const user = req.user as UserDetails;
    
    
    // Token is issued so it can be shared b/w HTTP and ws server
    // Todo: Make this temporary and add refresh logic here

    const userDb = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    const token = jwt.sign({ userId: user.id, name: userDb?.name }, JWT_SECRET);
    res.json({
      token,
      id: user.id,
      name: userDb?.name,
    });
  } else if (req.cookies && req.cookies.guest) {
    const decoded = jwt.verify(req.cookies.guest, JWT_SECRET) as userJwtClaims;
    const token = jwt.sign(
      { userId: decoded.userId, name: decoded.name, isGuest: true },
      JWT_SECRET,
    );
    let User: UserDetails = {
      id: decoded.userId,
      name: decoded.name,
      token: token,
      isGuest: true,
    };
    res.cookie('guest', token, { maxAge: COOKIE_MAX_AGE });
    res.json(User);
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
})

export default router;