import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { config } from './config.js';


passport.use(
    new GoogleStrategy(
        {
        clientID:config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
       passReqToCallback: true,
    },

    async(req,accessToken,refreshToken,profile,done)=>{
        try{
            console.log(
          "Callback URL:",
          "http://localhost:5000/api/auth/google/callback",
        );
        profile.selectedRole = req.query.state;
        return done(null, profile);
        }catch (error) {
        console.log(
          "Callback URL:",
          "http://localhost:5000/api/auth/google/callback",
        );
        return done(error, null);
      }
    }
)
)
export default passport;