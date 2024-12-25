const express = require("express");
const router = express.Router();
const { getUser,createFolder,deleteFolder,createForm,deleteForm,updateFormContent,getFormContent} = require("../controllers/mainController.js");


router.get("/user/:id", getUser);
router.get("/",(req, res) => res.send("Authenticated"));
router.post(("/folder/:id"),createFolder);
router.delete(("/folder/:id"),deleteFolder);
router.post(("/form/:id"),createForm);
router.delete(("/form/:id"),deleteForm);
router.put(("/form/:id"),updateFormContent);
router.get("/form/:id", getFormContent);
module.exports = router;
