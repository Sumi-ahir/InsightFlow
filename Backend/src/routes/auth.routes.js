import express from 'express';
import {register,login,getMe,logout,googleCallback} from '../controllers/auth.controller.js';
import { registerValidator,loginValidator } from '../validators/auth.validator.js';
import { authUser } from '../middleware/auth.middleware.js';
import passport from '../config/passport.config.js';
const authRouter = express.Router();
import { config } from '../config/config.js';

authRouter.post('/register', registerValidator, register);
authRouter.post('/login',loginValidator,login)
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
// authRouter.get(
//      "/google/callback",
//      passport.authenticate("google", {
//     session: false,
//    failureRedirect: `${config.FRONTEND_URL}/login`,
//   }),
//     googleCallback,
// );

authRouter.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    console.log("========== GOOGLE CALLBACK ==========");
    console.log("ERR:", err);
    console.log("INFO:", info);
    console.log("USER:", user);

    if (err) {
      return res.status(500).json({
        error: err.message,
        details: err,
      });
    }

    req.user = user;
    next();
  })(req, res, next);
}, googleCallback);
export default authRouter;