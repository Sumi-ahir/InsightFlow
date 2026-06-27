import jwt from "jsonwebtoken";

export function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized!",
      success: false,
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
}
