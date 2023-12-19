import User from "./../models/userModel.js";
import { hash } from "bcrypt";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await hash(password, 10);
  const createNewUser = new User({ username, email, password: hashedPassword });
  try {
    await createNewUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
