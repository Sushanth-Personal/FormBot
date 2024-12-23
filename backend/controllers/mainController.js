const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Folder = require("../models/folderModel");
const Form = require("../models/formModel");
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
    const forms = await Form.find({ userId });
    // Respond with the user data and folder names
    res.status(200).json({ user, folders,forms });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching user or folders:", error.message);

    // Handle server errors
    res.status(500).json({
      error:
        "An unexpected error occurred while fetching the user or folders.",
    });
  }
};

const createFolder = async (req, res) => {
  const { folderName } = req.body;
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
  const { folderName } = req.body;
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

    const deletedForm = await Form.findOneAndDelete({
      folderName: folderName,
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


// Create a new form
const createForm = async (req, res) => {
  try {
    const { formName,folderName } = req.body; // Extract data from the request body
    const { id } = req.params; // userId
    console.log(formName,folderName)
    // Validate userId
    const userId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
  
    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }


    // Create a new form linked to the folder and user
    const form = new Form({
      formName: formName,
      userId:userId, // Ensure the form is linked to the correct user
      folderName:folderName
    });
    
    await form.save(); // Save the form

    // Find all forms that belong to the same user and folder
    const forms = await Form.find({ 
      folderName:folderName, 
      userId: userId // Ensure the forms belong to the correct user
    });

    // Send back the forms
    res.status(201).json({ message: 'Form created successfully!', forms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating form', error });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { formName,folderName } = req.body; // Extract data from the request body
    const { id } = req.params; // userId
    console.log(formName,folderName)
    // Validate userId
    const userId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
  
    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }
    // Delete the form associated with the userId
    const deletedForm = await Form.findOneAndDelete({
      formName: formName,
      userId: userId,
      folderName:folderName
    });

    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found." });
    }

    // Retrieve all forms associated with the userId
    const userForms = await Form.find({ userId });

    // Respond with all form names
    res.status(200).json(userForms);
  } catch (error) {
    // Log the error for debugging
    console.error(
      "Error deleting form or retrieving forms:",
      error.message
    );

    // Handle server errors
    res.status(500).json({
      error:
        "An unexpected error occurred while processing the request.",
    });
  }
};





module.exports = { getUser, createFolder, deleteFolder, createForm, deleteForm };
