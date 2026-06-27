import express from 'express';
import {register,verifyEmail,login,getMe,logout,googleCallback} from '../controllers/auth.controller.js';
import { registerValidator,loginValidator } from '../validators/auth.validator.js';
import { authUser } from '../middleware/auth.middleware.js';
import passport from '../config/passport.config.js';
const authRouter = express.Router();
import { config } from '../config/config.js';

authRouter.post('/register', registerValidator, register);
authRouter.post('/login',loginValidator,login)
authRouter.get('/verify-email',verifyEmail)
authRouter.get('/me',authUser,getMe)
authRouter.post('/logout',logout)

// GOOGLE LOGIN
authRouter.get('/google',
    passport.authenticate('google',{
        scope:['profile','email'],
          prompt: "consent",
    })
)

// GOOGLE CALLBACK
authRouter.get(
     "/google/callback",
     passport.authenticate("google", {
    session: false,
failureRedirect: "http://localhost:5173/login",
  }),
    googleCallback,
);
export default authRouter;