import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "something";
console.log("checking google client id", GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

passport.serializeUser((user, done) => {
  done(null, user); // In real apps, serialize user.id
});

passport.deserializeUser((obj : any, done) => {
  done(null, obj); // Deserialize from session
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  // Here you can handle DB logic (find/create user)
  console.log("Google profile:", profile);
  return done(null, profile);
}));