const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");

const getUser = async (req, res) => {
    const { id } = req.params;
  
    const userId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
  
    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }
  
    try {
      // Validate input (ensure `userId` is a valid ObjectId format if applicable)
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }
  
      // Validate if the `userId` is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ error: "Invalid User ID format." });
      }
  
      // Fetch the user by ID, excluding cart details
      const user = await User.findById(userId); // Exclude 'cart' field using projection
  
      // If no user is found, return a 404 error
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Respond with the user data
      res.status(200).json(user);
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error fetching user:", error.message);
  
      // Handle server errors
      res.status(500).json({
        error: "An unexpected error occurred while fetching the user.",
      });
    }
  };
  

  module.exports = { getUser };