import userModle from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import crypto from "crypto";
import { config } from "../config/config.js";

// REGISTRATION
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    // CHECK USER
    const isUserAlreadyExist = await userModle.findOne({ email: cleanEmail });
    if (isUserAlreadyExist) {
      return res.status(400).json({
        message: "user already exist!",
        success: false,
      });
    }

    const user = await userModle.create({
      username,
      email: cleanEmail,
      password,
    });

    // token
    const emailVerificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    // email for verification
  try {
  await sendEmail({
    to: cleanEmail,
    subject: "Verify Your Email",
    html: `
      <h2>Welcome ${username}</h2>
      <p>Please verify your email.</p>

      <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">
        Verify Email
      </a>
    `,
  });
} catch (err) {
  console.error("Email sending failed:", err);

  return res.status(500).json({
    success: false,
    message: "Unable to send verification email.",
  });
}

    return res.status(201).json({
      message: "User registered successfully!",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Register error:", error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}
// EMAIL VERIFICATION
export async function verifyEmail(req, res) {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModle.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "User not found!",
      });
    }
    user.verified = true;
    await user.save();

    const html = ` 
        <h1>Email verified successfully!</h1>
        <p>Your email has been verified , Now you can log in</p>`;
    res.send(html);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or Expired token",
      success: false,
      err: err.message,
    });
  }
}
// LOGIN
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const user = await userModle.findOne({ email: cleanEmail }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }
    
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    //  CREATE TOKEN
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

 res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
   path: "/",
});
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

  return res.status(500).json({
 message:"Server error",
 error:err.message
});
  }
}
// logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
   path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
// GET ME
export const getMe = async (req, res) => {
  const userId = req.user.id;

  const user = await userModle.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
      err: "user not found!",
    });
  }
  return res.status(200).json({
    success: true,
    message: "user fetched successfully!",
    user,
  });
};

// GOOGLE CALLBACK
export const googleCallback = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "No user from Google (passport failed)",
      });
    }

    const { id, displayName, emails, photos } = req.user;

    const email = emails?.[0]?.value;
    const profilePic = photos?.[0]?.value;

    let user = await userModle.findOne({ email });

    if (!user) {
        // username duplicate check
      let username = displayName;
       const usernameExists = await userModle.findOne({ username });

      if (usernameExists) {
        username = `${displayName}_${Date.now()}`;
      }

      // random password
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36),
        10
      );

     user = await userModle.create({
  email,
  googleId: id,
  username,
  profilePic,
  verified: true,
});
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

 res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
   path: "/",
});

   return res.redirect(process.env.FRONTEND_URL + "/dashboard");
    // return res.redirect("http://localhost:5173/dashboard");

  } catch (error) {
    console.log("Google auth error:", error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: error.message,
    });
  }
};