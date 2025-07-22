const express = require('express');
const multer = require('multer');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// === Middleware ===
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

const upload = multer({ dest: 'uploads/' });

// === Conversion Logic ===
function escapeString(s) {
  return s.replace(/"/g, '\\"');
}

function toSymbol(s) {
  return `'${s}`;
}

function toMakeDate(dateStr) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (match) {
    return `(make-date ${match[1]} ${match[2]} ${match[3]})`;
  }
  return `"${escapeString(dateStr)}"`;
}

function toSExprItem(item) {
  let out = `(yaml:item`;
  for (const key in item) {
    const val = item[key];
    out += ` (yaml:${key} `;

    if (key === 'part_no') {
      out += toSymbol(val);
    } else if (typeof val === 'string' || typeof val === 'number') {
      const isNumber = /^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(val);
      out += isNumber ? val : `"${escapeString(val.toString())}"`;
    } else if (typeof val === 'object') {
      out += toSExprItem(val);
    }

    out += `)`;
  }
  out += `)`;
  return out;
}

function toSExprMap(node, prefix = 'yaml') {
  let out = '';
  for (const key in node) {
    const val = node[key];
    if (key === 'date' && typeof val === 'string') {
      out += `(${prefix}:date ${toMakeDate(val)})\n`;
    } else if (key === 'items' && Array.isArray(val)) {
      out += `(${prefix}:items ${val.map(toSExprItem).join(' ')})\n`;
    } else if (Array.isArray(val)) {
      out += `(${prefix}:${key} ${val.map(v => toSExprMap(v, prefix)).join(' ')})\n`;
    } else if (typeof val === 'object' && val !== null) {
      out += `(${prefix}:${key} ${toSExprMap(val, prefix)})\n`;
    } else {
      out += `(${prefix}:${key} "${escapeString(val.toString())}")\n`;
    }
  }
  return out;
}

// === API Endpoint ===
app.post('/api/convert', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = yaml.load(fileContent);
    const result = `(\n${toSExprMap(parsed)}\n)`;

    fs.unlinkSync(filePath); // cleanup
    res.send({ output: result });
  } catch (err) {
    res.status(400).json({ error: `Error: ${err.message}` });
  }
});

// === Fallback: serve React app ===
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
