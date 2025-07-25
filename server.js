const express = require('express');
const multer = require('multer');
const yaml = require('js-yaml');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configure CORS to allow the specific origin
app.use(cors({
  origin: 'https://yaml2sexpr.onrender.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Serve index.html from the root
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  fs.access(indexPath)
    .then(() => res.sendFile(indexPath))
    .catch(() => res.status(404).send('Index file not found'));
});

// Existing POST route for conversion
function isDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function quoteString(str) {
  return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\n')}"`;
}

function yamlToSexp(data, indent = 0, parentKey = '') {
  const indentStr = '  '.repeat(indent);
  if (data === null) {
    return 'null';
  } else if (typeof data === 'boolean') {
    return data ? 'true' : 'false';
  } else if (typeof data === 'number') {
    return data.toString();
  } else if (typeof data === 'string') {
    if (isDate(data)) {
      const [year, month, day] = data.split('-').map(Number);
      return `(make-date ${year} ${month} ${day})`;
    }
    return quoteString(data);
  } else if (Array.isArray(data)) {
    const isItems = parentKey === 'items';
    const elements = data.map(item => {
      const itemSexp = yamlToSexp(item, indent + 1, parentKey);
      return isItems ? `(yaml:item ${itemSexp})` : itemSexp;
    });
    if (elements.length === 0) return '()';
    return `(\n${indentStr}  ${elements.join('\n' + indentStr + '  ')}\n${indentStr})`;
  } else if (typeof data === 'object') {
    const entries = Object.entries(data).map(([key, value]) => {
      const valueSexp = yamlToSexp(value, indent + 1, key);
      return `(yaml:${key} ${valueSexp})`;
    });
    if (entries.length === 0) return '()';
    return `(\n${indentStr}  ${entries.join('\n' + indentStr + '  ')}\n${indentStr})`;
  }
  return 'unknown';
}

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileContent = await fs.readFile(req.file.path, 'utf-8');
    const yamlData = yaml.load(fileContent, { schema: yaml.DEFAULT_SCHEMA });
    const sexp = yamlToSexp(yamlData);
    await fs.unlink(req.file.path); // Clean up uploaded file
    res.json({ sexp, yaml: fileContent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});