import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { config } from './config.js';
console.log("CLIENT ID:", config.GOOGLE_CLIENT_ID);
console.log(
  "CLIENT SECRET:",
  config.GOOGLE_CLIENT_SECRET ? "Loaded" : "Missing"
);
console.log("BACKEND:", config.BACKEND_URL);


passport.use(
    new GoogleStrategy(
        {
        clientID:config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
       callbackURL: `${config.BACKEND_URL}/api/auth/google/callback`,
       passReqToCallback: true,
    },
  
    async(req,accessToken,refreshToken,profile,done)=>{
        try{
            console.log(
          "Callback URL:",
           config.GOOGLE_CALLBACK_URL,
        );
        profile.selectedRole = req.query.state;
        return done(null, profile);
        }catch (error) {
        console.log(
          "Callback URL:",
           config.GOOGLE_CALLBACK_URL,
        );
        return done(error, null);
      }
    }
)
)
export default passport;