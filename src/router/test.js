const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "hey welcome to our app",
	});
});

router.all("*", (req, res) => {
	res.status(404).json({
		success: false,
		message: "Requested endpoint doesn't exist!",
	});
});

module.exports = router;
