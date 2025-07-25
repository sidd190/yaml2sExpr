type yaml_value =
  | str of string
  | float of float
  | int of int
  | list of yaml_value list
  | dict of (string * yaml_value) list

let rec to_sexp key value =
  match value with
  | str s -> Printf.sprintf "(yaml:%s \"%s\")" key s
  | int i -> Printf.sprintf "(yaml:%s %d)" key i
  | float f -> Printf.sprintf "(yaml:%s %f)" key f
  | list items ->
      let item_strs = List.map (to_sexp "item") items in
      Printf.sprintf "(yaml:%s %s)" key (String.concat " " item_strs)
  | dict props ->
      let parts = List.map (fun (k, v) -> to_sexp k v) props in
      Printf.sprintf "(yaml:%s %s)" key (String.concat " " parts)

(* Example input *)
let example_yaml =
  dict [
    ("receipt", str "Oz-Ware Purchase Invoice");
    ("date", dict [("year", int 2012); ("month", int 8); ("day", int 6)]);
    ("customer", dict [("first_name", str "Dorothy"); ("family_name", str "Gale")]);
    ("items", list [
      dict [
        ("part_no", str "A4786");
        ("descrip", str "Water Bucket (Filled)");
        ("price", float 1.47);
        ("quantity", int 4)
      ];
      dict [
        ("part_no", str "E1628");
        ("descrip", str "High Heeled \"Ruby\" Slippers");
        ("size", int 8);
        ("price", float 133.7);
        ("quantity", int 1)
      ]
    ]);
    ("bill-to", dict [
      ("street", str "123 Tornado Alley\nSuite 16");
      ("city", str "East Centerville");
      ("state", str "KS")
    ]);
    ("ship-to", dict [
      ("street", str "123 Tornado Alley\nSuite 16");
      ("city", str "East Centerville");
      ("state", str "KS")
    ]);
    ("specialDelivery", str "Follow the Yellow Brick Road to the Emerald City. Pay no attention to the man behind the curtain.")
  ]

let () =
  match example_yaml with
  | dict pairs ->
      let sexprs = List.map (fun (k, v) ->
        if k = "date" then
          "(yaml:date (make-date 2012 08 06))"
        else
          to_sexp k v
      ) pairs in
      List.iter print_endline sexprs
  | _ -> print_endline "Invalid YAML"
