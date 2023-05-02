;; Comments
(documentation_comment) @comment
(line_comment) @comment

;; Keywords
(metadata_statement
 "metadata" @keyword)

;; Simple types
(simple_shape_statement
 type: (_) @keyword.simple_type
 name: (identifier) @type.definition)

;; Aggregate types
(enum_statement
 type: (_) @keyword.aggregate_type
 name: (identifier) @type.definition)

(enum_member
 name: (identifier) @constructor)

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

(structure_member
 name: (identifier) @variable
 type: (shape_id) @type)

(union_statement
 "union" @keyword.aggregate_type
 name: (identifier) @type.definition)

(union_member
 name: (identifier) @variable
 type: (shape_id) @type)

;; Service Types
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
 "output" @variable
 type: (shape_id) @type)

(operation_errors
 "errors" @variable
 (identifier) @type)

;; Values
(number) @number
(string_value (shape_id) @type)
(string_value (string) @string)

;; Constant Values
(true) @constant.builtin
(false) @constant.builtin
(null) @constant.builtin

;; Punctuation
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

;; Other References
(shape_section
 "use" @keyword
 (external_shape_id) @type)

(namespace_statement
 "namespace"  @keyword
 (namespace) @module)

(node_object_key) @variable

(structure_resource
 "for" @keyword
 (shape_id) @type)

(mixins
 "with" @keyword
 (shape_id) @type)

;; Traits
(trait
 type: (shape_id) @attribute)

(apply_statement
 "apply" @keyword
 target: (shape_id) @type)
