import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import fs from "fs";
console.log("Files in controllers:", fs.readdirSync("./controllers"));

// Importing routes
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";

import { userJwtMiddleware } from "./middlewares/authMiddleware.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve static files from the 'public' directory
app.use(express.static(path.join(path.resolve(), "public")));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/song", userJwtMiddleware, songRoutes);
app.use("/api/v1/playlist", userJwtMiddleware, playlistRoutes);
app.get("/api/v1/stream/:filename", async (req, res) => {
  try {
    // if no file name is provided throw an error
    if (!req.params.filename) {
      res.status(400);
      throw new Error("No file name provided");
    }
    // connection to the database and getting the file from the database

    const db = conn.db("music_streaming");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    // setting the content type of the file

    // streaming the file to the client
    const downloadStream = bucket
      .openDownloadStreamByName(req.params.filename)
      .pipe(res)
      .on("error", (error) => {
        throw error;
      });

    downloadStream.on("end", () => {
      res.end();
    });

    // if there is an error throw an error
  } catch (error) {
    console.log(error.message);
    return res.json({ error: error.message, status: "error" });
  }
});
app.get("/api/v1/songs", async (req, res) => {
  try {
    const db = conn.db("music_streaming");
    const collection = db.collection("songs");
    const songs = await collection.find({}).toArray();
    if (songs.length === 0) {
      res.status(404);
      throw new Error("No songs found");
    }
    res.status(200).json({ songs });
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message, status: "error" });
  }
});

// Fallback to index.html for SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

// Start the server
app.listen(1337, () => {
  console.log(`Server is running at localhost:1337`);
});
