const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), (req, res) => {
  const uploadedPath = req.file.path;

  execFile("./yaml2sexpr", [uploadedPath], { cwd: __dirname + "/.." }, (err, stdout, stderr) => {
    fs.unlink(uploadedPath, () => {}); // Delete temp file

    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }

    res.json({ sexp: stdout });
  });
});

module.exports = router;
