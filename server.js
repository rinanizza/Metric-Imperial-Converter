"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const app = express();

// Serve static files from the "public" directory
app.use("/public", express.static(process.cwd() + "/public"));

// Enable CORS for all origins (for FCC testing purposes)
app.use(cors({ origin: "*" }));

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the index.html file for the root route
app.route("/").get((req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Set up FCC testing routes
fccTestingRoutes(app);

// Set up API routes
apiRoutes(app);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).type("text").send("Not Found");
});

// Start the server and run tests if in test mode
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(() => {
      try {
        runner.run();
      } catch (e) {
        console.log("Tests are not valid:");
        console.log(e);
      }
    }, 1500);
  }
});

module.exports = app; // Export for testing
