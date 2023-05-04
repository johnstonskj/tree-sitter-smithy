;; Rule: version number should be "2".

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

;; Rule: Applied trait names must not start with an upper case letter.
((trait
  type: (shape_id
         shape_id: (identifier) @name))
 (#match? @name "^[A-Z]"))

;; Rule: Operations may only have one of each member.
