# YAML to S-expressions Converter

A multi-language implementation of a YAML to S-expression converter, inspired by the need to transform YAML configuration files into Lisp-style S-expressions for the SAIL (Semantic Analysis of Instruction Languages) to CGEN (Code Generator) workflow.

## Overview

This project demonstrates different approaches to converting YAML data structures into S-expressions across multiple programming languages and platforms:

- **Web Application** (JavaScript/Node.js) - Full-featured converter with file upload
- **C++ Implementation** - Static example with hardcoded data
- **OCaml Implementation** - Functional programming approach

## Blog Post

This implementation is based on the blog post: [From YAML to S-expressions](https://decamuse.hashnode.dev/from-yaml-to-s-expressions)

## 🚀 Live Demo

**Try it now!** Test the YAML to S-expression converter directly in your browser:

**[https://yaml2sexpr.onrender.com/](https://yaml2sexpr.onrender.com/)**

Upload your YAML files and see the conversion in real-time with syntax highlighting, copy functionality, and downloadable results.

## Features

### Web Application

- **File Upload**: Upload YAML files directly through the web interface
- **Real-time Conversion**: Instant conversion from YAML to S-expressions
- **Syntax Highlighting**: YAML input is highlighted for better readability
- **Download Output**: Save converted S-expressions as `.sexp` files
- **Copy to Clipboard**: Quick copy functionality for both input and output
- **Error Handling**: Comprehensive error messages for invalid YAML

### Core Conversion Logic

- **Type Preservation**: Maintains data types (strings, numbers, booleans, arrays, objects)
- **Date Handling**: Special handling for date strings (YYYY-MM-DD format) converted to `(make-date year month day)`
- **String Escaping**: Proper escaping of quotes and special characters
- **Nested Structures**: Support for deeply nested YAML structures
- **Array Processing**: Special handling for `items` arrays with `yaml:item` prefixes

## File Structure

```
├── index.html          # React-based web interface
├── server.js           # Express.js backend server
├── package.json        # Node.js dependencies
├── yaml2sexp.cpp       # C++ implementation
├── yaml2sexp.ml        # OCaml implementation
└── README.md           # This file
```

## Installation & Usage

### Web Application

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start the Server**:

   ```bash
   npm start
   ```

3. **Access the Application**:
   Open your browser to `http://localhost:3000`

4. **Upload and Convert**:
   - Click "Choose File" and select a YAML file
   - Click "Submit" to convert
   - View the results in the output panel
   - Download or copy the S-expression output

### C++ Implementation

```bash
g++ -o yaml2sexp yaml2sexp.cpp
./yaml2sexp
```

### OCaml Implementation

```bash
ocaml yaml2sexp.ml
```

## Example Conversion

### Input YAML:

```yaml
receipt: Oz-Ware Purchase Invoice
date: 2012-08-06
customer:
  first_name: Dorothy
  family_name: Gale
items:
  - part_no: A4786
    descrip: Water Bucket (Filled)
    price: 1.47
    quantity: 4
  - part_no: E1628
    descrip: High Heeled "Ruby" Slippers
    size: 8
    price: 133.7
    quantity: 1
```

### Output S-expression:

```lisp
(
  (yaml:receipt "Oz-Ware Purchase Invoice")
  (yaml:date (make-date 2012 8 6))
  (yaml:customer
    (
      (yaml:first_name "Dorothy")
      (yaml:family_name "Gale")
    ))
  (yaml:items
    (
      (yaml:item
        (
          (yaml:part_no "A4786")
          (yaml:descrip "Water Bucket (Filled)")
          (yaml:price 1.47)
          (yaml:quantity 4)
        ))
      (yaml:item
        (
          (yaml:part_no "E1628")
          (yaml:descrip "High Heeled \"Ruby\" Slippers")
          (yaml:size 8)
          (yaml:price 133.7)
          (yaml:quantity 1)
        ))
    ))
)
```

## Technical Details

### Conversion Rules

1. **Objects**: Converted to nested S-expressions with `yaml:` prefixed keys
2. **Arrays**: Each element wrapped in appropriate structure, with special handling for `items` arrays
3. **Strings**: Quoted and escaped properly
4. **Numbers**: Preserved as-is (integers and floats)
5. **Booleans**: Converted to `true`/`false`
6. **Dates**: YYYY-MM-DD format converted to `(make-date year month day)`
7. **Null values**: Converted to `null`

### Dependencies

#### Node.js (Web Application)

- `express` - Web server framework
- `multer` - File upload handling
- `js-yaml` - YAML parsing
- `cors` - Cross-origin resource sharing
- React (CDN) - Frontend framework
- Tailwind CSS (CDN) - Styling
- Highlight.js (CDN) - Syntax highlighting

#### C++

- Standard library only
- Requires C++11 or later

#### OCaml

- Standard library only
- Compatible with OCaml 4.x+

## Deployment

The web application is configured for deployment on Render.com with CORS settings for `https://yaml2sexpr.onrender.com`.

## License

Open source - feel free to use and modify as needed.
