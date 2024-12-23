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
    // Fetch the user by ID
    const user = await User.findById(userId);

    // If no user is found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Fetch all folders associated with the userId
    const folders = await Folder.find({ userId }).select("name -_id"); // Assuming `Folder` model exists

    // Initialize an object to hold folder-wise forms
    const folderForms = {};

    // Iterate through folders to fetch forms associated with each
    for (const folder of folders) {
      const forms = await Form.find({ userId, folderName: folder.name }).select("formName -_id");
      folderForms[folder.name] = forms.map((form) => form.formName);
    }
    console.log(folderForms);
    // Respond with the user data and structured folder-to-forms mapping
    res.status(200).json({ user, folders: folders.map((f) => f.name), folderForms });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching user or folders:", error.message);

    // Handle server errors
    res.status(500).json({
      error:
        "An unexpected error occurred while fetching the user, folders, or forms.",
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
    const userFolders = await Folder.find({ userId }).select("name"); // Only select folder names

    // Map to get an array of folder names
    const folderNames = userFolders.map(folder => folder.name);

    // Respond with the array of folder names
    res.status(201).json(folderNames);
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
    const formsByFolder = await Form.find({ userId }).select(
      "formName folderName -_id"
    );

    const folderForms = {};
    formsByFolder.forEach((form) => {
      if (!folderForms[form.folderName]) {
        folderForms[form.folderName] = [];
      }
      folderForms[form.folderName].push(form.formName);
    });

    // Include folders that have no forms (empty folders)
    const folders = await Folder.find({ userId }).select("name -_id");
    const folderNames = folders.map((f) => f.name);

    // Ensure every folder is represented, even if empty
    folderNames.forEach((folderName) => {
      if (!folderForms[folderName]) {
        folderForms[folderName] = []; // Initialize empty array for folders without forms
      }
    });

    // Respond with folders and folder-to-forms mapping
    res.status(200).json({ folders: folderNames, folderForms });
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
    const { formName, folderName } = req.body; // Extract data from the request body
    const { id } = req.params; // userId
    console.log(formName, folderName);

    // Validate userId
    const userId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }


    // Create a new form linked to the folder and user
    const form = new Form({
      formName,
      userId, // Ensure the form is linked to the correct user
      folderName,
    });

    
    await form.save(); // Save the form

    // Retrieve all forms grouped by their folders
    const formsByFolder = await Form.find({ userId }).select(
      "formName folderName -_id"
    );

    const folderForms = {};
    formsByFolder.forEach((form) => {
      if (!folderForms[form.folderName]) {
        folderForms[form.folderName] = [];
      }
      folderForms[form.folderName].push(form.formName);
    });

    // Retrieve all folder names associated with the user
    const folders = await Folder.find({ userId }).select("name -_id");

    // Respond with the folder names array and folder-to-forms mapping
    res
      .status(200)
      .json({ folders: folders.map((f) => f.name), folderForms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating form", error });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { formName, folderName } = req.body; // Extract data from the request body
    const { id } = req.params; // userId

    // Validate userId
    const userId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Check if folder exists
    const folderExists = await Folder.findOne({ userId, name: folderName });
    if (!folderExists) {
      return res.status(404).json({ error: "Folder not found." });
    }

    // Delete the specified form
    const deletedForm = await Form.findOneAndDelete({
      userId,
      folderName,
      formName,
    });

    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found." });
    }

    // Fetch all forms and group them by folder
    const formsByFolder = await Form.find({ userId }).select(
      "formName folderName -_id"
    );

    const folderForms = {};
    formsByFolder.forEach((form) => {
      if (!folderForms[form.folderName]) {
        folderForms[form.folderName] = [];
      }
      folderForms[form.folderName].push(form.formName);
    });

    // Include folders that have no forms (empty folders)
    const folders = await Folder.find({ userId }).select("name -_id");
    const folderNames = folders.map((f) => f.name);

    // Ensure every folder is represented, even if empty
    folderNames.forEach((folderName) => {
      if (!folderForms[folderName]) {
        folderForms[folderName] = []; // Initialize empty array for folders without forms
      }
    });

    // Respond with folders and folder-to-forms mapping
    res.status(200).json({ folders: folderNames, folderForms });
  } catch (error) {
    console.error("Error deleting form or retrieving forms:", error.message);
    res.status(500).json({
      error: "An unexpected error occurred while processing the request.",
    });
  }
};







module.exports = { getUser, createFolder, deleteFolder, createForm, deleteForm };
