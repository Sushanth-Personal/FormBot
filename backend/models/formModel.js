const mongoose = require('mongoose');

const formElementSchema = new mongoose.Schema({
  buttonType: {
    type: String,
    required: true,
  },
  content: {
    type: String, // For text, image URL, or placeholder text for input fields
    required: function () {
      return this.type === 'text' || this.type === 'image';
    },
  },
  order: {
    type: Number, // Determines the order of elements in the form
    required: true,
  },
});

const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming a User model exists
    required: true,
  },
  folderName: {
    type: String,
    required: true,
  },
  elements: [formElementSchema], // Array of form elements
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model('Form', formSchema);
