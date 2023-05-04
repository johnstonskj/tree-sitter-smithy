;; Rule: version number should be "2".
(control_statement
 ((node_object_key) @name (#eq? @name "version"))
 ((node_value) @value) (#eq? @value "\"2\""))

;; Rule: Object keys must not start with an upper case letter.
((node_object_key) @variable
 (#match? @variable "^[A-Z]"))

;; Rule: Structure member names must not start with an upper case letter.
((structure_member
  name: (identifier) @variable)
 (#match? @variable "^[A-Z]"))

;; Rule: Shape ID member names must not start with an upper case letter.
((shape_id_member
  member_id: (identifier) @name)
 (#match? @name "^[A-Z]"))

;; Rule: Variant (enum members) names must be all upper case.
((enum_member
  name: (identifier) @variant)
 (#match? @variant "[a-z]"))

;; Rule: Shape names (references) must not start with a lower case letter.
((shape_id
  shape_id: (identifier) @name)
 (#match? @variant "^[a-z]"))

;; Rule: Shape names (statements) must not start with a lower case letter.
((enum_member
  name: (identifier) @variant)
 (#match? @variant "[a-z]"))

;; Rule: Applied trait names must not start with an upper case letter.
((trait
  type: (shape_id
         shape_id: (identifier) @name))
 (#match? @name "^[A-Z]"))

;; Rule: Shapes should have doc comments
((documentation_comment)* @doc
 .
 (shape_statement) @shape
 (#match? @doc "^$"))

;; Rule: Operation naming convention
(operation_statement
 name: (identifier) @name
 (#not-match? @name "^(Batch)?(Create|Get|List|Put|Update|Delete).*$"))

;; Rule: Operation input structure naming convention
(operation_input
 type: (shape_id
        shape_id: (identifier) @name)
 (#not-match? @name "^(Batch)?(Create|Get|List|Put|Update|Delete).*(Input)$"))

;; Rule: Operation output structure naming convention
(operation_output
 type: (shape_id
        shape_id: (identifier) @name)
 (#not-match? @name "^(Batch)?(Create|Get|List|Put|Update|Delete).*(Output)$"))

;; Rule: List naming convention
(list_statement
 name: (identifier) @name
 (#not-match? @name "(List)$"))

;; Rule: Map naming convention
(map_statement
 name: (identifier) @name
 (#not-match? @name "(Map(ing)?)$"))


;; Rule: Operations may only have one of each member.
