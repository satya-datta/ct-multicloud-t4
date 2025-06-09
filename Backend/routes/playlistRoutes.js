import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = conn.db("music_streaming");
    const collection = db.collection("playlists");
    const playlists = await collection
      .find({ createdBy: req.userId })
      .toArray();
    if (playlists.length === 0) {
      res.status(404);
      throw new Error("No playlists found");
    }
    res.status(200).json({ playlists });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message, status: "error" });
  }
}); //get all playlists
router.get("/:id", async (req, res) => {
  try {
    const db = conn.db("music_streaming");
    const collection = db.collection("playlists");

    const playlist = await collection.findOne({
      _id: new mongodb.ObjectId(req.params.id),
    });
    if (playlist) {
      return res.status(200).json({ playlist });
    } else throw new Error("Error getting playlist");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, status: "error" });
  }
}); //get a playlist
router.post("/create", async (req, res) => {
  try {
    // Establishing connection to the database

    const db = conn.db("music_streaming");
    const collection = db.collection("playlists");

    // Inserting the playlist to the database
    const playList = await collection.insertOne({
      playlistName: req.body.playlistName,
      createdBy: req.userId,
      songs: [],
    });
    // If the playlist is added successfully return a success message
    if (playList) {
      return res
        .status(200)
        .json({ message: "Playlist added successfully", status: "success" });
    } else throw new Error("Error adding playlist");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, status: "error" });
  }
}); //add new playlist
router.delete("/delete/:id", async (req, res) => {
  try {
    const db = conn.db("music_streaming");
    const collection = db.collection("playlists");

    const playlist = await collection.deleteOne({
      _id: new mongodb.ObjectId(req.params.id),
    });
    if (playlist) {
      return res
        .status(200)
        .json({ message: "Playlist deleted successfully", status: "success" });
    } else throw new Error("Error deleting playlist");
  } catch (error) {
    console.log(error.message);
    return res.json({ error: error.message, status: "error" });
  }
}); //delete a playlist
router.post("/add/:id", async (req, res) => {
  try {
    const db = conn.db("music_streaming");
    const collection = db.collection("playlists");

    const playlist = await collection.findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $push: { songs: req.body[0] } }
    );
    if (playlist) {
      return res
        .status(200)
        .json({ message: "Song added to playlist", status: "success" });
    } else throw new Error("Error adding song to playlist");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, status: "error" });
  }
  res.send("Add Song to Playlist Page");
}); //add song to playlist
router.delete("/remove/:id", async (req, res) => {
  try {
    const db = conn.db("music_streaming");
    const collection = db.collection("playlists");

    const playlist = await collection.findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $pull: { songs: { title: req.query.song } } }
    );
    res.status(200).json({ message: "Song removed from playlist" });
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message, status: "error" });
  }
}); //remove song from playlist

export default router;
