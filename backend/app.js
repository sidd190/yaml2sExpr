const express = require("express");
const cors = require("cors");
const convertRoute = require("./routes/convert");
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
app.use("/convert", convertRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
