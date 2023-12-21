import User from "./../models/userModel.js";
import bcrypt from "bcrypt";
import { errorHandler } from "./../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Hashing  the password from bcrypt to avoid e.g hacking of one's account
    const hashedPassword = await bcrypt.hash(password, 10);

    // We are creating a new user with the hashed password
    const createNewUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Then we are saving the new user to the database
    await createNewUser.save();

    // Then responding with a success message
    res.status(201).json("User created successfully");
  } catch (error) {
    // Handling any errors that occur during the process
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not Found!!"));

    // Comparing Passwords using bcrypt to check if the user password is correct
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong Credentials"));
    }

    ///We are now creating a token and cookie once a user signs in or logs in
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    //Once the user has logged in we don't want to see his/her her password which is hashed, so this function helps us to do so!!
    const { password: pass, ...rest } = validUser._doc;

    //The return statement that tells us that everything that the user has come out to be successful!!
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

//Signing in with Google
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4) +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("acceess_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

///Signing out of the user
export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
