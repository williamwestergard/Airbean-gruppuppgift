const express = require("express");

const app = express();
const PORT = 4001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
