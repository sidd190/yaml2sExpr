# SAIL to CGEN - Coding Challenge

## Overview
This project reads structured data in the form of YAML (with a fixed schema) and produces an S-expression format representation of the same data.
It takes a yaml file as input, sends  it to the c++ binary file for conversion and displays & returns it to download.

## Input
- YAML file (with a fixed schema, e.g., the Wikipedia YAML example)

## Output
- S-expression representation of the input data

## Usage
1. Just upload the file and click convert

## Example
Given the YAML input from Wikipedia link : {https://en.wikipedia.org/wiki/YAML#Example}, the output will be:

```
((yaml:receipt "Oz-Ware Purchase Invoice")
 (yaml:date (make-date 2012 08 06))
 (yaml:customer (yaml:first_name "Dorothy") (yaml:family_name "Gale"))
 (yaml:items (yaml:item (yaml:part_no 'A4786) (yaml:descrip "Water Bucket (Filled)") (yaml:price 1.47) (yaml:quantity 4))
  (yaml:item (yaml:part_no 'E1628) (yaml:descrip "High Heeled \"Ruby\" Slippers") (yaml:size 8) (yaml:price 133.7) (yaml:quantity 1))))
```

## Author
- Siddharth Bansal 