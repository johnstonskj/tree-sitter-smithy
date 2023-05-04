;; ---------------------------------------------------------------------------
;; Comments
;; ---------------------------------------------------------------------------

(documentation_comment) @comment
(line_comment) @comment

;; ---------------------------------------------------------------------------
;; Control and Metadata
;; ---------------------------------------------------------------------------

(metadata_statement
 "metadata" @keyword
 "=" @operator)

(namespace_statement
 "namespace"  @keyword
 (namespace) @module)

(shape_section
 "use" @keyword
 (external_shape_id) @type)

;; ---------------------------------------------------------------------------
;; Shape statements
;; ---------------------------------------------------------------------------

(mixins
 "with" @keyword
 (shape_id) @type)

;; ---------- Simple Shapes ----------

(simple_shape_statement
 type: (_) @keyword.simple_type
 name: (identifier) @type.definition)

(enum_statement
 type: (_) @keyword.simple_type
 name: (identifier) @type.definition)

(enum_member
 name: (identifier) @constructor)

(value_assignment
 "=" @operator)

;; ---------- Aggregate Shapes ----------

(list_statement
 "list" @keyword.aggregate_type
 name: (identifier) @type.definition)

(list_member
 "member" @variable
 member_type: (shape_id) @type)

(map_statement
 "map" @keyword.aggregate_type
 name: (identifier) @type.definition)

(map_key
 "key" @variable
 key_type: (shape_id) @type)

(map_value
 "value" @variable
 value_type: (shape_id) @type)

(structure_statement
 "structure" @keyword.aggregate_type
 name: (identifier) @type.definition)

(structure_resource
 "for" @keyword
 (shape_id) @type)

(structure_member
 name: (identifier) @variable
 type: (shape_id) @type)

(union_statement
 "union" @keyword.aggregate_type
 name: (identifier) @type.definition)

(union_member
 name: (identifier) @variable
 type: (shape_id) @type)

;; ---------- Service Shapes ----------

(service_statement
 "service" @keyword.service_type
 name: (identifier) @type.definition)

(resource_statement
 "resource" @keyword.service_type
 name: (identifier) @type.definition)

(operation_statement
 "operation" @keyword.service_type
 name: (identifier) @type.definition)

(operation_input
 "input" @variable
 type: (shape_id) @type)

(operation_output
 "output" @variable)

(operation_output
 type: (shape_id) @type)

(inline_structure
 ":=" @operator)

(operation_errors
 "errors" @variable
 (identifier) @type)

;; ---------------------------------------------------------------------------
;; Traits
;; ---------------------------------------------------------------------------

(trait
 "@" @attribute
 type: (shape_id) @attribute)

(apply_statement
 "apply" @keyword
 target: (shape_id) @type)

;; ---------------------------------------------------------------------------
;; Values
;; ---------------------------------------------------------------------------

(node_object_key) @variable

(number) @number
(string_value (shape_id) @type)
(string_value (string) @string)

;; ---------------------------------------------------------------------------
;; Constant Values
;; ---------------------------------------------------------------------------

(true) @constant.builtin
(false) @constant.builtin
(null) @constant.builtin

;; ---------------------------------------------------------------------------
;; Punctuation
;; ---------------------------------------------------------------------------

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

(node_object
 "," @punctuation.delimiter)

(mixins
 "," @punctuation.delimiter)

(enum_members
 "," @punctuation.delimiter)

(structure_members
 "," @punctuation.delimiter)

(union_members
 "," @punctuation.delimiter)

(operation_body
 "," @punctuation.delimiter)

(operation_errors
 "," @punctuation.delimiter)

(trait_structure
 "," @punctuation.delimiter)

(apply_statement
 "," @punctuation.delimiter)

(control_statement
 "$" @keyword
 ":" @punctuation.delimiter)

(node_object_kvp
 ":" @punctuation.delimiter)

(list_member
 ":" @punctuation.delimiter)

(map_key
 ":" @punctuation.delimiter)

(map_value
 ":" @punctuation.delimiter)

(structure_member
 ":" @punctuation.delimiter)

(union_member
 ":" @punctuation.delimiter)

(operation_input
 ":" @punctuation.delimiter)

(operation_output
 ":" @punctuation.delimiter)

(operation_errors
 ":" @punctuation.delimiter)

(trait_structure_kvp
 ":" @punctuation.delimiter)

;; setup rules for @punctuation.delimiter

;; ---------------------------------------------------------------------------
;; Errors
;; ---------------------------------------------------------------------------

;; Highlight errors in red. This is not very useful in practice, as text will
;; be highlighted as user types, and the error could be elsewhere in the code.

(ERROR) @error
