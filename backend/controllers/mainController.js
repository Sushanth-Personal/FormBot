const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Folder = require("../models/folderModel");
const Form = require("../models/formModel");
const Response = require("../models/responseModel");
const Analytics = require("../models/analyticsModel");
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
      const forms = await Form.find({
        userId,
        folderName: folder.name,
      }).select("formName -_id");
      folderForms[folder.name] = forms.map((form) => form.formName);
    }
    console.log(folderForms);
    // Respond with the user data and structured folder-to-forms mapping
    res.status(200).json({
      user,
      folders: folders.map((f) => f.name),
      folderForms,
    });
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
    const folderNames = userFolders.map((folder) => folder.name);

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

    if (!deletedFolder) {
      return res.status(404).json({ error: "Folder not found." });
    }

    // Delete all forms associated with the folder
    const deletedForms = await Form.deleteMany({
      folderName: folderName,
      userId: userId,
    });

    // Delete associated Response and Analytics entries
    await Response.deleteMany({
      formName: { $in: deletedForms.map((form) => form.formName) },
      folderName: folderName,
      userId: userId,
    });

    await Analytics.deleteMany({
      formName: { $in: deletedForms.map((form) => form.formName) },
      folderName: folderName,
      userId: userId,
    });

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
      return res
        .status(400)
        .json({ message: "Invalid userId format" });
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
      return res
        .status(400)
        .json({ message: "Invalid userId format" });
    }

    // Check if folder exists
    const folderExists = await Folder.findOne({
      userId,
      name: folderName,
    });
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

    // Delete corresponding analytics and responses
    await Analytics.deleteMany({
      userId,
      formName,
      folderName,
    });

    await Response.deleteMany({
      userId,
      formName,
      folderName,
    });

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
    console.error(
      "Error deleting form or retrieving forms:",
      error.message
    );
    res.status(500).json({
      error:
        "An unexpected error occurred while processing the request.",
    });
  }
};


const updateFormContent = async (req, res) => {
  try {
    console.log("Reaching updateFormContent");

    const { id } = req.params; // userId
    console.log(id);

    // Validate userId
    const userId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Invalid userId format" });
    }

    // Destructure data from the request body
    const { formName, folderName, elements, newFormName } = req.body;
    console.log(formName, folderName, elements);
    if(newFormName){
      try {
        const existingForm = await Form.findOne({ formName, userId, folderName });
      if(existingForm){
        existingForm.formName = newFormName;
       
        await Analytics.updateMany(
          { userId, formName, folderName },
          { $set: { formName: newFormName } }
        );
        
        await Response.updateMany(
          { userId, formName, folderName },
          { $set: { formName: newFormName } }
        );
        
        await existingForm.save();
        return res.status(200).json({ message: "Form name updated successfully" });
      }else{
       return res.status(404).json({ error: "Form not found" });
      }
      } catch (error) {
       return res.status(500).json({ error: "Server error" });
      }
    }
    // Check if all required fields are present
    if (!formName || !folderName || !elements) {
      return res
        .status(400)
        .json({ error: "Missing required fields" });
    }

    // Find the existing form by formName and userId
    const existingForm = await Form.findOne({ formName, userId});

    if (!existingForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Update the form fields
    existingForm.folderName = folderName;
    existingForm.elements = elements;

    // Save the updated form
    await existingForm.save();

    // Send success response
    res.status(200).json({
      message: "Form updated successfully",
      form: existingForm,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const addFormResponses = async (req, res) => {
  const { id } = req.params;
  const { folderName, formName, responses } = req.body;
  console.log(responses);

  // Validate userId
  const userId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    // Check if the form exists by userId, formName, and folderName
    const form = await Form.findOne({ formName, userId, folderName });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Find the latest response by userId, formName, and folderName, ordered by the timestamp or creation date
    const latestResponse = await Response.findOne({
      userId,
      folderName,
      formName,
    }).sort({ timestamp: -1 }); // Sort by timestamp in descending order to get the latest response

    // Get the last user value (if exists) and increment it by 1
    const lastUserValue = latestResponse ? latestResponse.user : 0; // Default to 0 if no previous responses

    // Create a new user value for all responses based on the last user value
    const newUser = lastUserValue + 1;

    // Iterate over all responses and save them
    const savedResponses = [];
    for (const resp of responses) {
      if (!resp.order || !resp.buttonType) {
        return res.status(400).json({ message: 'order and buttonType are required for each response' });
      }

      const { buttonType, response, order, timestamp } = resp;

      // Check if the element exists in the form by order and buttonType
      const element = form.elements.find(
        (el) => el.order === order && el.buttonType === buttonType
      );
      console.log("element", element);

      if (element) {
        // Save the response to the Response model with the same user value for all responses
        const newResponse = new Response({
          userId,  // Save the userId from the request
          folderName,
          formName,
          user: newUser,  // Set user as the last user value + 1 for all responses
          buttonType,
          content: element.content,  // Assuming content comes from the element in the form
          response,
          order,
          timestamp: new Date(timestamp),  // Make sure to set timestamp
        });

        // Save the new response
        await newResponse.save();

        // Add the saved response to the array
        savedResponses.push(newResponse);
      }
    }

    // Return the saved responses array
    res.status(200).json({ message: "Responses added successfully", responses: savedResponses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding responses", error: error.message });
  }
};

const getFormResponses = async (req, res) => {
  const { id } = req.params;  // The userId is sent as part of the URL params
  const { folderName, formName } = req.query;  // folderName and formName are part of the query parameters
  console.log("reached", folderName, formName);
  // Validate userId
  const userId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    // Fetch all responses for the given userId, folderName, and formName
    const responses = await Response.find({ userId, folderName, formName });
    console.log(responses);
    if (!responses || responses.length === 0) {
      return res.status(404).json({ message: "No responses found for the given form" });
    }

    // Return the found responses
    res.status(200).json({ message: "Responses fetched successfully", responses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching responses", error: error.message });
  }
};

const getFormContent = async (req, res) => {
  try {
    console.log("Reaching getFormContent");

    // Extract userId from route parameters
    const { id } = req.params;
    console.log("UserId:", id);

    // Validate userId
    const userId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Invalid userId format" });
    }
    // Extract formName and folderName from query parameters
    const { formName, folderName } = req.query;
    console.log("formName:", formName, "folderName:", folderName);

    // Check if all required fields are provided
    if (!formName || !folderName) {
      return res
        .status(400)
        .json({ error: "Missing formName or folderName" });
    }

    // Query the database for the form
    const form = await Form.findOne({
      userId,
      formName,
      folderName,
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Return the form data including responses
    res.status(200).json({
      formName: form.formName,
      folderName: form.folderName,
      elements: form.elements,
      responses: form.responses,
    });
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const updateAnalytics = async (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  const { folderName, formName, analytics } = req.body; // Extract folderName, formName, and analytics from the request body

  // Validate the provided ID
  const userId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
  if (!userId) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    // Define the update operation based on the analytics value
    let updateOperation = {};

    if (analytics === "view") {
      updateOperation = { $inc: { view: 1 } };
    } else if (analytics === "start") {
      updateOperation = { $inc: { start: 1 } };
    } else if (analytics === "completed") {
      updateOperation = { $inc: { completed: 1 } };
    } else {
      return res.status(400).json({ message: "Invalid analytics type" });
    }

    // Find the document to update or create a new one if it doesn't exist
    const result = await Analytics.findOneAndUpdate(
      { userId, folderName, formName },
      updateOperation,
      { new: true, upsert: true } // Create a new document if one doesn't exist
    );
    console.log(result);
    // Send the updated document as the response
    res.status(200).json({ message: "Analytics updated successfully", data: result });
  } catch (error) {
    console.error("Error updating analytics:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  const { id } = req.params; // User ID from URL params
  const { folderName, formName } = req.query; // Folder name and form name from query params

  // Validate userId
  const userId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    // Query the analytics data
    const analyticsData = await Analytics.findOne({
      userId: userId,
      folderName: folderName,
      formName: formName,
    });

    console.log("analyticsData", analyticsData);

    if (!analyticsData) {
      return res.status(404).json({ message: "Analytics data not found" });
    }

    // Send analytics data
    res.status(200).json({
      view: analyticsData.view,
      start: analyticsData.start,
      completed: analyticsData.completed,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  getUser,
  createFolder,
  deleteFolder,
  createForm,
  deleteForm,
  updateFormContent,
  getFormContent,
  addFormResponses,
  getFormResponses,
  updateAnalytics,
  getAnalytics
};
