module.exports = grammar({
    name: 'smithy',

    rules: {
        file: $ => seq(
            $.control_section,
            $.metadata_section,
            $.shape_section
        ),

        control_section: $ => repeat(
            $.control_statement
        ),

        control_statement: $ => seq(
            '$',
            $.node_object_key,
            ':',
            $.node_value
        ),

        metadata_section: $ => seq(
            /metadata/i,
            $.node_object_key,
            '=',
            $.node_value
        ),

        node_value: $ => choice(
            $.node_array,
            $.node_object,
            $.number,
            $.node_keywords,
            $.node_string_value
        ),

        node_array: $ => seq(
            '[',
            repeat($.node_value),
            ']'
        ),

        node_object: $ => seq(
            '{',
            repeat1($.node_object_kvp),
            '}'
        ),

        node_object_kvp: $ => seq(
            $.node_object_key,
            ':',
            node_value
        ),

        node_object_key: $ => choice(
            $.quoted_text,
            $.identifier
        ),

        number: $ => seq(
            optional('-'),
            $.int,
            optional($.frac),
            optional($.exp)
        ),

        int: $ => /0|[1-9][0-9]*/,

        frac: $ => /\.[0-9]+/,

        exp: $ => /[eE][+\-][0-9]+/,

        node_keywords: $ => /true|false|null/i,

        // ...

        shape_section: $ => optional(
            $.namespace_statement,
            repeat(
                $.use_statement
            ),
            repeat(
                $shape_or_apply_statement
            )
        ),

        namespace_statement: $ => seq(
            /namespace/i,
            $.namespace
        ),

        use_statement: $ => seq(
            /use/i,
            $.absolute_root_shape_id
        ),

        shape_or_apply_statement: $ => choice(
            $.shape_statement,
            $.apply_statement
        ),

        shape_statement: $ => seq(
            repeat($.trait_statement),
            $.shape_body
        ),

        shape_body: $ => choice(
            $.simple_shape_statement,
            $.enum_shape_statement,
            $.list_statement,
            $.map_statement,
            $.structure_statement,
            $.union_statement,
            $.service_statement,
            $.operation_statement,
            $.resource_statement
        ),

        simple_shape_statement: $ => seq(
            $.simple_type_name,
            $.identifier,
            optional($.mixins)
        ),

        simple_type_name: $ => /blob|boolean|document|string|byte|short|integer|long|float|double|bigInteger|bigDecimal|timestamp/i,

        mixins: $ => seq(
            /with/i,
            '[',
            repeat1($.shape_id),
            ']'
        ),

        enum_shape_statement: $ => seq(
            /enum|intEnum/i,
            $.identifier,
            optional($.mixins),
            $.enum_shape_members
        ),

        enum_shape_members: $ seq(
            '{',
            repeat1(
                seq(
                    repeat($.trait_statement),
                    identifier,
                    optional($.value_assignment)
                )
            ),
            '}'
        ),

        value_assignment: $ => seq(
            '=',
            $.node_value,
        ),

        list_statement: $ => seq(
            /list/i,
            identifier,
            optional($.mixins),
            $.list_members
        ),

        list_members: $ => seq(
            '{',
            repeat($.list_member),
            '}'
        ),

        list_member: $ => seq(
            repeat($.trait_statement),
            /member/i,
            optional(
                seq(
                    ':',
                    shape_id
                )
            )
        ),

        map_statement: $ => seq(
            /map/i,
            identifier,
            optional($.mixins),
            $.map_members
        ),

        map_members: $ => seq(
            '{',
            repeat(
                choice(
                    $.map_key,
                    $.map_value,
                    seq(
                        $.map_key,
                        $.map_value
                    )
                )
            ),
            '}'
        ),

        map_key: $ => seq(
            repeat($.trait_statement),
            /key/i,
            optional(
                seq(
                    ':',
                    $.shape_id
                )
            )
        ),

        map_value: $ => seq(
            repeat($.trait_statement),
            /value/i,
            optional(
                seq(
                    ':',
                    $.shape_id
                )
            )
        ),

        structure_statement: $ => seq(
            /structure/i,
            $.identifier,
            optional($.structure_resource),
            optional($.mixins),
            $.structure_members
        ),

        structure_resource: $ => seq(
            /for/i,
            $.shape_id
        ),

        structure_members: $ => seq(
            '{',
            repeat(
                seq(
                    repeat($.trait_statement),
                    $.structure_member
                )
            ),
            '}'
        ),

        structure_member: $ => seq(
            choice(
                seq(
                    $.identifier,
                    ':',
                    $.shape_id
                ),
                seq(
                    '$',
                    identifier
                )
            ),
            $.value_assignment
        ),

        union_statement: $ => seq(
            /union/i,
            $.identifier,
            optional($.mixins),
            $.union_members
        ),

        union_members: $ => seq(
            '{',
            repeat(
                choice(
                    seq(
                        $.identifier,
                        ':',
                        $.shape_id
                    ),
                    seq(
                        '$',
                        identifier
                    )
                )
            ),
            '}'
        ),

        service_statement: $ => seq(
            /service/i,
            $.identifier,
            optional($.mixins),
            $.node_object
        ),

        resource_statement: $ => seq(
            /resource/i,
            $.identifier,
            optional($.mixins),
            $.node_object
        ),

        operation_statement: $ => seq(
            /resource/i,
            $.identifier,
            optional($.mixins),
            $.operation_body
        ),

        operation_body: $ => seq(
            '{',
            repeat(
                choice(
                    $.operation_input,
                    $.operation_output,
                    $.operation_errors
                )
            ),
            '}'
        ),

        operation_input: $ => seq(
            /input/i,
            choice(
                $.inline_structure,
                seq(
                    ':',
                    $.shape_id
                )
            )
        ),

        operation_output: $ => seq(
            /output/i,
            choice(
                $.inline_structure,
                seq(
                    ':',
                    $.shape_id
                )
            )
        ),

        operation_errors: $ => seq(
            /errors/,
            ':',
            '[',
            repeat($.identifier),
            ']'
        ),

        inline_structure: $ => seq(
            ':=',
            repeat($.trait_statement),
            optional($.structure_resource),
            optional($.mixins),
            $.structure_members
        ),

        trait_statement: $ => seq(
            '@',
            $.shape_id,
            optional($.trait_body)
        ),

        trait_body: $ => seq(
            '(',
            choice(
                repeat1(
                    $.trait_structure_kvp
                ),
                $.node_value
            ),
            ')'
        ),

        trait_structure_kvp: $ => seq(
            $.node_object_key,
            ':',
            $.node_value
        ),

        apply_statement: $ => seq(
            /apply/i,
            $.shape_id,
            choice(
                $.trait_statement,
                seq(
                    '{',
                    repeat(
                        $.trait_statement
                    ),
                    '}'
                )
            )
        ),

        shape_id: $ => seq(
            $.root_shape_id,
            optional($.shape_id_member)
        ),

        root_shape_id: $ => choice(
            $.absolute_root_shape_id,
            $.identifier
        ),

        absolute_root_shape_id: $ => seq(
            $.namespace,
            '#',
            $.identifier
        ),

        namespace: $ => seq(
            $.identifier,
            repeat(
                seq(
                    '.',
                    identifier
                )
            )
        ),

        identifier: $ => /((_+[])[])[_]/,

        shape_id_member: $ => seq(
            '$',
            $.identifier
        ),
    }
});
