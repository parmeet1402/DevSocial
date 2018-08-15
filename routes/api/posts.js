const express = require("express");

//set up a router
const router = express.Router();

// set the route

// Route  --> GET api/posts/
// Desc   --> Tests post route
// Access --> Public
router.get("/", (req, res) =>
  res.json({
    message: "posts works"
  })
);

// expose the router constant to server.js
module.exports = router;
