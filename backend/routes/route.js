const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/mainController.js");


router.get("/user/:id", getUser);
router.get("/",(req, res) => res.send("Authenticated"));

module.exports = router;
