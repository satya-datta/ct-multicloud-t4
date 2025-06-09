import express from "express";
import multer from "multer";
import conn from "../config/db.js";
import fs from "fs";
import mongodb from "mongodb";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // getting the data from the request body
    const { title, artist, album, description } = req.body;

    // if any of the fields are empty throw an error
    if (!title || !artist || !album || !description) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    // connction to the database
    const db = conn.db("music_streaming");
    const collection = db.collection("songs");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    // uploading the file to the database
    const readStream = fs
      .createReadStream(req.file.path)
      .pipe(bucket.openUploadStream(req.file.filename));

    // if there is an error throw an error
    readStream.on("error", (error) => {
      throw error;
    });

    // if the file is uploaded successfully delete the file from the uploads folder
    // and insert the song data to the database
    readStream.on("finish", async () => {
      console.log("finished");
      const song = await collection.insertOne({
        title,
        artist,
        album,
        description,
        uploadedBy: req.userId,
        song: req.file.filename,
        file: readStream.id,
      });
      if (song) {
        res
          .status(201)
          .json({ message: "Song added successfully", status: "success" });
      } else {
        res.status(400);
        throw new Error("Invalid song data");
      }
    });
  } catch (error) {
    console.log(error);

    return res.json({ error: error.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    console.log("hitting the server");
    console.log(req.query.file);
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("No id provided");
    }

    const db = conn.db("music_streaming");
    const collection = db.collection("songs");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const song = await collection.findOne({ _id: new mongodb.ObjectId(id) });
    if (!song) {
      res.status(404);
      throw new Error("Song not found");
    }
    if (song.uploadedBy !== req.userId) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    const deleteSong = await collection.deleteOne({
      _id: new mongodb.ObjectId(id),
    });
    if (deleteSong) {
      await bucket.delete(new mongodb.ObjectId(req.query.file));
      res
        .status(200)
        .json({ message: "Song deleted successfully", status: "success" });
    } else {
      res.status(400);
      throw new Error("Error deleting song");
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message, status: "error" });
  }
});

export default router;
