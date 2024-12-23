const express = require("express");
const router = express.Router();
const { getUser,createFolder,deleteFolder } = require("../controllers/mainController.js");


router.get("/user/:id", getUser);
router.get("/",(req, res) => res.send("Authenticated"));
router.post(("/folder/:id"),createFolder);
router.delete(("/folder/:id"),deleteFolder);
module.exports = router;
