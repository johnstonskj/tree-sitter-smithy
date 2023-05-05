;; ---------------------------------------------------------------------------
;; Preamble
;; ---------------------------------------------------------------------------

;; Rule: Version number *should* be "2".
(control_statement
 ((node_object_key) @name (#eq? @name "version"))
 ((node_value) @value) (#eq? @value "\"2\""))

;; ---------------------------------------------------------------------------
;; Type Names
;; ---------------------------------------------------------------------------

;; Rule: Shape identifiers (references) *must not* start with a lower case letter.
((shape_id
  shape_id: (identifier) @name)
 (#match? @variant "^[a-z]"))

;; Rule: Shape identifiers (statements) *must not* start with a lower case letter.
((enum_member
  name: (identifier) @variant)
 (#match? @variant "[a-z]"))

;; ---------------------------------------------------------------------------
;; Members Names
;; ---------------------------------------------------------------------------

;; Rule: Object keys *must not* start with an upper case letter.
((node_object_key) @variable
 (#match? @variable "^[A-Z]"))

;; Rule: Structure member identifiers *must not* start with an upper case letter.
((structure_member
  name: (identifier) @variable)
 (#match? @variable "^[A-Z]"))

;; Rule: Shape ID member identifiers *must not* start with an upper case letter.
((shape_id_member
  member_id: (identifier) @name)
 (#match? @name "^[A-Z]"))

;; ---------------------------------------------------------------------------
;; Enum Variants
;; ---------------------------------------------------------------------------

;; Rule: Variant (enum members) identifiers *must* be all upper case.
((enum_member
  name: (identifier) @variant)
 (#match? @variant "[a-z]"))

;; ---------------------------------------------------------------------------
;; Additional Naming
;; ---------------------------------------------------------------------------

;; Rule: List types *should* end with the string "List"
(list_statement
 name: (identifier) @name
 (#not-match? @name "(List)$"))

;; Rule: Map types *should* end with the string "Map" or "Mapping"
(map_statement
 name: (identifier) @name
 (#not-match? @name "(Map(ing)?)$"))

;; Rule: Operations *should* follow a functional naming convention
(operation_statement
 name: (identifier) @name
 (#not-match? @name "^(Batch)?(Create|Get|List|Put|Update|Delete).*$"))

;; Rule: Operation input structures *should* follow a functional naming convention
(operation_input
 type: (shape_id
        shape_id: (identifier) @name)
 (#not-match? @name "^(Batch)?(Create|Get|List|Put|Update|Delete).*(Input)$"))

;; Rule: Operation output structures *should* follow a functional naming convention
(operation_output
 type: (shape_id
        shape_id: (identifier) @name)
 (#not-match? @name "^(Batch)?(Create|Get|List|Put|Update|Delete).*(Output)$"))

;; ---------------------------------------------------------------------------
;; Traits
;; ---------------------------------------------------------------------------

;; Rule: Applied trait identifiers *must not* start with an upper case letter.
((trait
  type: (shape_id
         shape_id: (identifier) @name))
 (#match? @name "^[A-Z]"))

;; ---------------------------------------------------------------------------
;; Other
;; ---------------------------------------------------------------------------

;; Rule: All shapes *should* have documentation comments
((documentation_comment)* @doc
 .
 (shape_statement) @shape
 (#match? @doc "^$"))

;; ---------------------------------------------------------------------------
;; Not Yet Done
;; ---------------------------------------------------------------------------

;; Rule: Operations may only have one of each member.
