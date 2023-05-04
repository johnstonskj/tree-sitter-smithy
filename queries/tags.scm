;; ---------------------------------------------------------------------------
;; Names of members
;; ---------------------------------------------------------------------------

(node_object_key
 (identifier) @name)

(enum_member
 name: (identifier) @name)

(structure_member
 name: (identifier) @name)

(list_member
 "member" @name)

(map_key
 "key" @name)

(map_value
 "value" @name)

(operation_input
 "input" @name)

(operation_output
 "output" @name)

(operation_errors
 "errors" @name)

;; ---------------------------------------------------------------------------
;; Type References
;; ---------------------------------------------------------------------------

(shape_section
 uses: (external_shape_id) @reference.type)

(mixins (shape_id) @reference.type)

(list_member
 member_type: (shape_id) @reference.type)

(map_key
 key_type: (shape_id) @reference.type)

(map_value
 value_type: (shape_id) @reference.type)

(operation_input
 type: (shape_id) @reference.type)

(operation_output
 type: (shape_id) @reference.type)

(operation_errors
 (identifier) @reference.type)

(trait
 type: (shape_id) @reference.trait)

(apply_statement
 target: (shape_id) @reference.type)


;; ---------------------------------------------------------------------------
;; Type Definitions
;; ---------------------------------------------------------------------------

(simple_shape_statement
 name: (identifier) @definition.type)

(enum_statement
 name: (identifier) @definition.type)

(list_statement
 name: (identifier) @definition.type)

(map_statement
 name: (identifier) @definition.type)

(structure_statement
 name: (identifier) @definition.type)

(union_statement
 name: (identifier) @definition.type)

(service_statement
 name: (identifier) @definition.type)

(resource_statement
 name: (identifier) @definition.type)

(operation_statement
 name: (identifier) @definition.type)
