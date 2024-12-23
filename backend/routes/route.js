const express = require("express");
const router = express.Router();
const { getUser,createFolder,deleteFolder,createForm,deleteForm,updateFormContent } = require("../controllers/mainController.js");


router.get("/user/:id", getUser);
router.get("/",(req, res) => res.send("Authenticated"));
router.post(("/folder/:id"),createFolder);
router.delete(("/folder/:id"),deleteFolder);
router.post(("/form/:id"),createForm);
router.delete(("/form/:id"),deleteForm);
router.put(("/form/:id"),updateFormContent);
module.exports = router;
