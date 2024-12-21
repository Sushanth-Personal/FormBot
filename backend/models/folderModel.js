const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Folder name
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' }, // Reference to a form (optional initially)
  createdAt: { type: Date, default: Date.now }, // Timestamp for creation
});

module.exports = mongoose.model('Folder', folderSchema);
