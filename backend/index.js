const express = require("express");

const app = express();
const port = 4000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Course Review Platform API!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
