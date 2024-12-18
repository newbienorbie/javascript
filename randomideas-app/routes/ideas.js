const express = require("express");

const router = express.Router();

const Idea = require("../models/Idea");

// get all ideas
router.get("/", async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json({ success: true, data: ideas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

// get a single idea
router.get("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    res.json({ success: true, data: idea });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

// add an idea
router.post("/", async (req, res) => {
  const idea = new Idea({
    // id: ideas.length + 1, id is automatically added with mongo
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
    // date: new Date().toISOString().slice(0, 10), we have set this in the model
  });

  try {
    const savedIdea = await idea.save();
    res.json({ success: true, data: savedIdea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

// update idea
router.put("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // check if username matches
    if (idea.username === req.body.username) {
      const updatedIdea = await Idea.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            text: req.body.text,
            tag: req.body.tag,
          },
        },
        { new: true }
      );
      return res.json({ success: true, data: updatedIdea });
    }

    // if usernames don't match
    res.status(403).json({
      success: false,
      error: "You are not authorized to delete this resource",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

// delete idea
router.delete("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // check if username matches
    if (idea.username === req.body.username) {
      await Idea.findByIdAndDelete(req.params.id);
      return res.json({ success: true, data: {} });
    }

    // if usernames don't match
    res.status(403).json({
      success: false,
      error: "You are not authorized to delete this resource",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

module.exports = router;
