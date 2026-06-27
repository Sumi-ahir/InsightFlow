import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  next();
}
export const registerValidator = [
  body("username")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("usernamr is required!")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("username can only contain letter,number and underscores"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("please enter valid email!"),

  body("password")
    .trim()
    .isStrongPassword()
    .withMessage("password must be strong!")
    .isLength({ min: 6 })
    .withMessage("password must be more then 6 character!")
    .notEmpty()
    .withMessage("password is required!"),

  validate,
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("please enter valid email!"),

  body("password").trim().notEmpty().withMessage("password is required!"),

  validate,
];
