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
