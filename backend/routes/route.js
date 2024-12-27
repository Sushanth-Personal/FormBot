const express = require("express");
const router = express.Router();
const { getUser,createFolder,deleteFolder,createForm,deleteForm,updateFormContent,getFormContent,addFormResponses, getFormResponses, updateAnalytics, getAnalytics} = require("../controllers/mainController.js");


router.get("/user/:id", getUser);
router.get("/",(req, res) => res.send("Authenticated"));
router.post(("/folder/:id"),createFolder);
router.delete(("/folder/:id"),deleteFolder);
router.post(("/form/:id"),createForm);
router.delete(("/form/:id"),deleteForm);
router.put(("/form/:id"),updateFormContent);
router.get("/form/:id", getFormContent);
router.post(("/form/response/:id"),addFormResponses);
router.get("/form/response/:id", getFormResponses);
router.put(("/analytics/:id"),updateAnalytics);
router.get("/analytics/:id", getAnalytics);
module.exports = router;
