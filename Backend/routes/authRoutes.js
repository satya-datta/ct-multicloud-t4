import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import conn from "../config/db.js";
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //if any of the fields are empty
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const db = conn.db("music_streaming");
    const collection = db.collection("users");
    // Check if user exists
    const user = await collection.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        message: "User logged in",
        status: "success",
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.send(err.message);
  }
}); //login route
router.post("/register", async (req, res) => {
  try {
    //Get the informaiton from the request body
    const { fullName, email, password } = req.body;

    //if any of the fields are empty
    if (!fullName || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const db = conn.db("music_streaming");
    const collection = db.collection("users");

    // Check if user exists
    const userExists = await collection.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await collection.insertOne({
      fullName,
      email,
      password: hashedPassword,
      playllists: [],
    });
    if (user) {
      res.status(201).json({
        message: "user registered",
        status: "success",
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (err) {
    console.log(err.message);
    return res.send(err.message);
  }
}); //register route

export default router;
