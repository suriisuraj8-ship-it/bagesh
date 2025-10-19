const express = require("express");
const app = express();

// Serve all frontend files
app.use(express.static(__dirname));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
