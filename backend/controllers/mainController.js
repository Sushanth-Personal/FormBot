const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Folder = require("../models/folderModel");
const getUser = async (req, res) => {
  const { id } = req.params;

  // Validate and convert the ID
  const userId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    // Fetch the user by ID, excluding 'cart' field
    const user = await User.findById(userId);

    // If no user is found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Fetch all folders associated with the userId
    const folders = await Folder.find({ userId }).select("name -_id"); // Assuming `Folder` model exists

    // Respond with the user data and folder names
    res.status(200).json({ user, folders });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching user or folders:", error.message);

    // Handle server errors
    res.status(500).json({
      error: "An unexpected error occurred while fetching the user or folders.",
    });
  }
};


const createFolder = async (req, res) => {
  const {folderName } = req.body;
  const { id } = req.params; // userId

  // Validate userId
  const userId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    // Create a new folder associated with the userId
    const newFolder = new Folder({ name: folderName, userId });
    await newFolder.save();

    // Retrieve all folders associated with the userId
    const userFolders = await Folder.find({ userId }).select(
      "name -_id"
    ); // Only select folder names

    // Respond with all folder names
    res.status(201).json(userFolders);
  } catch (error) {
    // Log the error for debugging
    console.error(
      "Error creating folder or retrieving folders:",
      error.message
    );

    // Handle server errors
    res.status(500).json({
      error:
        "An unexpected error occurred while processing the request.",
    });
  }
};

const deleteFolder = async (req, res) => {
  const {folderName} = req.body;
  const { id } = req.params; // userId
  console.log("folderName", folderName);
  // Validate userId
  const userId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    // Delete the folder associated with the userId
    const deletedFolder = await Folder.findOneAndDelete({
      name: folderName,
      userId: userId,
    });

    if (!deletedFolder) {
      return res.status(404).json({ error: "Folder not found." });
    }

    // Retrieve all folders associated with the userId
    const userFolders = await Folder.find({ userId }).select(
      "name -_id"
    ); // Only select folder 

    // Respond with all folder names
    res.status(200).json(userFolders);
  } catch (error) {
    // Log the error for debugging
    console.error(
      "Error deleting folder or retrieving folders:",
      error.message
    );

    // Handle server errors
    res.status(500).json({
      error:
        "An unexpected error occurred while processing the request.",
    });
  }
};


module.exports = { getUser, createFolder, deleteFolder };
