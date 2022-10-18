import express from "express";
import mongoose from "mongoose";
import postMessage from "../models/postMessage.js";

const router = express.Router();

export const getPost = async (req, res) => {
  try {
    const postMessages = await postMessage.find();
    // console.log(postMessages);
    res.status(200).json(postMessages);
  } catch (error) {
    res.stutus(404).json({ message: error.message });
  }
};
export const createPost = (req, res) => {
  const post = req.body;
  const newPost = new postMessage(post);
  try {
    newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.stutus(409).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await postMessage.findByIdAndRemove(id);
  // res.json({ message: "Post deleted successfully." });
  res.json(post);
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await postMessage.findById(id);

  const updatedPost = await postMessage.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.json(updatedPost);
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { creator, title, message, tags, selectedFile } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).write(`No post with id : ${id}`);
  }
  const updatedPostNew = {
    creator,
    title,
    message,
    tags,
    selectedFile,
    _id: id,
  };

  const postBack = await postMessage.findByIdAndUpdate(id, updatedPostNew, {
    new: true,
  });

  res.json(postBack);
};

export default router;
