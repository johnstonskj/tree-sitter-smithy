// -------------------------------------------------------------------
// Project:    tree-sitter-smithy
// Author:     Simon Johnston <johntonskj@gmail.com>
// Version:    0.1.0
// Repository: https://github.com/johnstonskj/tree-sitter-smithy
//
// License: MIT
//
// This grammar is based on the Smithy 2.0 specification at
// https://smithy.io/2.0/spec/idl.html
//
// -------------------------------------------------------------------


const ID = /((_+[a-z0-9])|[a-z])[a-z0-9_]*/i
const NAMESPACE = new RegExp(ID.source + '(\\.' + ID.source + ')*', 'i')
const MEMBER_ID = new RegExp('\\$' + ID.source, 'i')
const ABS_ROOT_ID = new RegExp(NAMESPACE.source + '#' + ID.source, 'i')
const ROOT_ID = new RegExp('(' + ABS_ROOT_ID.source + ')|(' + ID.source + ')', 'i')
const SHAPE_ID = new RegExp(ROOT_ID.source + '(' + MEMBER_ID.source + ')?', 'i')


module.exports = grammar({
    name: 'smithy',

    word: $ => $.identifier,

    extras: $ => [
        /\s/,
        $._comment
    ],

    rules: {
        // -------------------------------------------------------------------
        // Smithy IDL
        // -------------------------------------------------------------------

        // idl =
        //     [WS] ControlSection MetadataSection ShapeSection
        idl: $ => seq(
            optional($.control_section),
            optional($.metadata_section),
            optional($.shape_section)
        ),

        // -------------------------------------------------------------------
        // Comments
        // -------------------------------------------------------------------

        // Comment =
        //     DocumentationComment / LineComment
        _comment: $ => choice(
            $.documentation_comment,
            $.line_comment
        ),

        // DocumentationComment =
        //     "///" *NotNL NL
        documentation_comment: $ => /[\/]{3}[^\n\r]*/,

        // LineComment =
        //     "//" *NotNL NL
        line_comment: $ =>  /[\/]{2}[^\n\r]*/,

        // -------------------------------------------------------------------
        // Control
        // -------------------------------------------------------------------

        // ControlSection =
        //     *(ControlStatement)
        control_section: $ => repeat1(
            $.control_statement
        ),

        // ControlStatement =
        //     "$" NodeObjectKey [SP] ":" [SP] NodeValue BR
        control_statement: $ => seq(
            '$',
            field('key', $.node_object_key),
            ':',
            field('value', $.node_value)
        ),

        // -------------------------------------------------------------------
        // Metadata
        // -------------------------------------------------------------------

        // MetadataSection =
        //     *(MetadataStatement)
        metadata_section: $ => repeat1(
            $.metadata_statement
        ),

        // MetadataStatement =
        //     %s"metadata" SP NodeObjectKey [SP] "=" [SP] NodeValue BR
        metadata_statement: $ => seq(
            /metadata/i,
            field('key', $.node_object_key),
            '=',
            field('value', $.node_value)
        ),

        // -------------------------------------------------------------------
        // Node values
        // -------------------------------------------------------------------

        // NodeValue =
        //     NodeArray / NodeObject / Number / NodeKeywords / NodeStringValue
        node_value: $ => choice(
            $.node_array,
            $.node_object,
            $.number,
            $.node_value_keyword,
            $.node_string_value
        ),

        // NodeArray =
        //     "[" [WS] *(NodeValue [WS]) "]"
        node_array: $ => seq(
            '[',
            field('values', repeat($.node_value)),
            ']'
        ),

        // NodeObject =
        //     "{" [WS] [NodeObjectKvp *(WS NodeObjectKvp)] [WS] "}"
        node_object: $ => seq(
            '{',
            field('values', repeat1($.node_object_kvp)),
            '}'
        ),

        // NodeObjectKvp =
        //     NodeObjectKey [WS] ":" [WS] NodeValue
        node_object_kvp: $ => seq(
            field('key', $.node_object_key),
            ':',
            field('value', $.node_value)
        ),

        // NodeObjectKey =
        //     QuotedText / Identifier
        node_object_key: $ => choice(
            $.quoted_text,
            $.identifier
        ),

        // Number = [Minus] Int [Frac] [Exp]
        // DecimalPoint = %x2E ; .
        // DigitOneToNine = %x31-39 ; 1-9
        // E = %x65 / %x45 ; e E
        // Exp = E [Minus / Plus] 1*DIGIT
        // Frac = DecimalPoint 1*DIGIT
        // Int = Zero / (DigitOneToNine *DIGIT)
        // Minus = %x2D ; -
        // Plus = %x2B ; +
        // Zero = %x30 ; 0
        number: $ => /([-]?(0|[1-9][0-9]*))(\.[0-9]+)?([e][+\-][0-9]+)?/i,

        // NodeKeywords =
        //     %s"true" / %s"false" / %s"null"
        node_value_keyword: $ => /true|false|null/i,

        // NodeStringValue =
        //     ShapeId / TextBlock / QuotedText
        node_string_value: $ => choice(
            $.shape_id,
            $.text_block,
            $.quoted_text
        ),

        // QuotedText =
        //     DQUOTE *QuotedChar DQUOTE
        quoted_text: $ => seq(
            '"',
            repeat($._quoted_char),
            '"'
        ),

        // QuotedChar =
        //     %x09        ; tab
        //     / %x20-21     ; space - "!"
        //     / %x23-5B     ; "#" - "["
        //     / %x5D-10FFFF ; "]"+
        //     / EscapedChar
        //     / NL
        // EscapedChar =
        //     Escape (Escape / DQUOTE / %s"b" / %s"f"
        //             / %s"n" / %s"r" / %s"t" / "/"
        //             / UnicodeEscape)
        // UnicodeEscape = %s"u" Hex Hex Hex Hex
        // Hex = DIGIT / %x41-46 / %x61-66
        // Escape = %x5C ; backslash
        _quoted_char: $ => /([^ --"\\])|(\\[\\"bfnrt\/])|(\\[uU][0-9a-f]{4})/i,

        // TextBlock =
        //     ThreeDquotes [SP] NL *TextBlockContent ThreeDquotes
        // TextBlockContent =
        //     QuotedChar / (1*2DQUOTE 1*QuotedChar)
        // ThreeDquotes =
        //     DQUOTE DQUOTE DQUOTE
        text_block: $ => seq(
            /"""[ ]*\n/,
            repeat(
                choice($._quoted_char, /"["]?[^"]/)
            ),
            '"""'
        ),

        // -------------------------------------------------------------------
        // Shapes
        // -------------------------------------------------------------------

        // ShapeSection =
        //     [NamespaceStatement UseSection [ShapeStatements]]
        shape_section: $ => seq(
            field('namespace', $.namespace_statement),
            field(
                'uses',
                repeat(
                    $._use_statement
                )
            ),
            field(
                'shapes',
                repeat(
                    $._shape_or_apply_statement
                )
            )
        ),

        // NamespaceStatement =
        //     %s"namespace" SP Namespace BR
        namespace_statement: $ => seq(
            /namespace/i,
            $.namespace
        ),

        // UseSection =
        //     *(UseStatement)
        // UseStatement =
        //     %s"use" SP AbsoluteRootShapeId BR
        _use_statement: $ => seq(
            /use/i,
            $.absolute_root_shape_id
        ),

        // ShapeStatements =
        //     ShapeOrApplyStatement *(BR ShapeOrApplyStatement)
        // ShapeOrApplyStatement =
        //     ShapeStatement / ApplyStatement
        _shape_or_apply_statement: $ => choice(
            $.shape_statement,
            $.apply_statement
        ),

        // ShapeStatement =
        //     TraitStatements ShapeBody
        shape_statement: $ => seq(
            field('traits', repeat($.trait_statement)),
            field('shape', $._shape_body)
        ),

        // ShapeBody =
        //     SimpleShapeStatement
        //     / EnumShapeStatement / ListStatement / MapStatement
        //     / StructureStatement / UnionStatement
        //     / ServiceStatement / OperationStatement / ResourceStatement
        _shape_body: $ => choice(
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

        // SimpleShapeStatement =
        //     SimpleTypeName SP Identifier [Mixins]
        simple_shape_statement: $ => seq(
            field('type', $._simple_type_name),
            field('name', $.identifier),
            field('mixins', optional($.mixins))
        ),

        // SimpleTypeName =
        //     %s"blob" / %s"boolean" / %s"document" / %s"string"
        //     / %s"byte" / %s"short" / %s"integer" / %s"long"
        //     / %s"float" / %s"double" / %s"bigInteger"
        //     / %s"bigDecimal" / %s"timestamp"
        _simple_type_name: $ => choice(
            alias(/blob/i, 'blob'),
            alias(/boolean/i, 'boolean'),
            alias(/document/i, 'document'),
            alias(/string/i, 'string'),
            alias(/byte/i, 'byte'),
            alias(/short/i, 'short'),
            alias(/integer/i, 'integer'),
            alias(/long/i, 'long'),
            alias(/float/i, 'float'),
            alias(/double/i, 'double'),
            alias(/bigInteger/i, 'bigInteger'),
            alias(/bigDecimal/i, 'bigDecimal'),
            alias(/timestamp/i, 'timestamp'),
        ),

        // Mixins =
        //     [SP] %s"with" [WS] "[" 1*([WS] ShapeId) [WS] "]"
        mixins: $ => seq(
            /with/i,
            '[',
            repeat1($.shape_id),
            ']'
        ),

        // EnumShapeStatement =
        //     EnumTypeName SP Identifier [Mixins] [WS] EnumShapeMembers
        // EnumTypeName =
        //     %s"enum" / %s"intEnum"
        enum_shape_statement: $ => seq(
            field(
                'type',
                choice(
                    alias(/enum/i, 'enum'),
                    alias(/intEnum/i, 'int_enum')
                )
            ),
            field('name', $.identifier),
            field('mixins', optional($.mixins)),
            field('members', $._enum_shape_members)
        ),

        // EnumShapeMembers =
        //     "{" [WS] 1*(TraitStatements Identifier [ValueAssignment] [WS]) "}"
        _enum_shape_members: $ => seq(
            '{',
            repeat1(
                $.enum_shape_member
            ),
            '}'
        ),

        // ==> TraitStatements Identifier [ValueAssignment] [WS]
        enum_shape_member: $ => seq(
            field('traits', repeat($.trait_statement)),
            field('name', $.identifier),
            field('value', optional($.value_assignment))
        ),

        // ValueAssignment =
        //     [SP] "=" [SP] NodeValue BR
        value_assignment: $ => seq(
            '=',
            $.node_value,
        ),

        // ListStatement =
        //     %s"list" SP Identifier [Mixins] [WS] ListMembers
        list_statement: $ => seq(
            /list/i,
            field('name', $.identifier),
            field('mixins', optional($.mixins)),
            field('members', $._list_members)
        ),

        // ListMembers =
        //     "{" [WS] [ListMember] [WS] "}"
        _list_members: $ => seq(
            '{',
            $.list_member,
            '}'
        ),

        // ListMember =
        //     TraitStatements (ElidedListMember / ExplicitListMember)
        // ElidedListMember =
        //     %s"$member"
        // ExplicitListMember =
        //     %s"member" [SP] ":" [SP] ShapeId
        list_member: $ => seq(
            field('traits', repeat($.trait_statement)),
            /member/i,
            field(
                'member_type',
                optional(
                    seq(
                        ':',
                        $.shape_id
                    )
                )
            )
        ),

        // MapStatement =
        //     %s"map" SP Identifier [Mixins] [WS] MapMembers
        map_statement: $ => seq(
            /map/i,
            field('name', $.identifier),
            field('mixins', optional($.mixins)),
            field('members', $._map_members)
        ),

        // MapMembers =
        //     "{" [WS] [MapKey / MapValue / (MapKey WS MapValue)] [WS] "}"
        _map_members: $ => seq(
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

        // MapKey =
        //     TraitStatements (ElidedMapKey / ExplicitMapKey)
        // ElidedMapKey =
        //     %s"$key"
        // ExplicitMapKey =
        //     %s"key" [SP] ":" [SP] ShapeId
        map_key: $ => seq(
            field('traits', repeat($.trait_statement)),
            /key/i,
            field(
                'key_type',
                optional(
                    seq(
                        ':',
                        $.shape_id
                    )
                )
            )
        ),

        // MapValue =
        //     TraitStatements (ElidedMapValue / ExplicitMapValue)
        // ElidedMapValue =
        //     %s"$value"
        // ExplicitMapValue =
        //     %s"value" [SP] ":" [SP] ShapeId
        map_value: $ => seq(
            field('traits', repeat($.trait_statement)),
            /value/i,
            field(
                'value_type',
                optional(
                    seq(
                        ':',
                        $.shape_id
                    )
                )
            )
        ),

        // StructureStatement =
        //     %s"structure" SP Identifier [StructureResource]
        //         [Mixins] [WS] StructureMembers
        structure_statement: $ => seq(
            /structure/i,
            field('name', $.identifier),
            field('resource', optional($._structure_resource)),
            field('mixins', optional($.mixins)),
            field('members', $._structure_members)
        ),

        // StructureResource =
        //     SP %s"for" SP ShapeId
        _structure_resource: $ => seq(
            /for/i,
            $.shape_id
        ),

        // StructureMembers =
        //     "{" [WS] *(TraitStatements StructureMember [WS]) "}"
        _structure_members: $ => seq(
            '{',
            repeat(
                $.structure_member
            ),
            '}'
        ),

        // StructureMember =
        //     (ExplicitStructureMember / ElidedStructureMember) [ValueAssignment]
        // ExplicitStructureMember =
        //     Identifier [SP] ":" [SP] ShapeId
        // ElidedStructureMember =
        //     "$" Identifier
        structure_member: $ => seq(
            field('traits', repeat($.trait_statement)),
            choice(
                seq(
                    field('name', $.identifier),
                    ':',
                    field('type', $.shape_id)
                ),
                field('name', $.shape_id_member)
            ),
            field('value', optional($.value_assignment))
        ),

        // UnionStatement =
        //     %s"union" SP Identifier [Mixins] [WS] UnionMembers
        union_statement: $ => seq(
            /union/i,
            field('name', $.identifier),
            field('mixins', optional($.mixins)),
            field('members', $._union_members)
        ),

        // UnionMembers =
        //     "{" [WS] *(TraitStatements UnionMember [WS]) "}"
        _union_members: $ => seq(
            '{',
            repeat(
                $.union_member
            ),
            '}'
        ),

        // UnionMember =
        //     (ExplicitStructureMember / ElidedStructureMember)
        union_member: $ => seq(
            field('traits', repeat($.trait_statement)),
            choice(
                seq(
                    field('name', $.identifier),
                    ':',
                    field('type', $.shape_id)
                ),
                field('name', $.shape_id_member)
            )
        ),

        // ServiceStatement =
        //     %s"service" SP Identifier [Mixins] [WS] NodeObject
        service_statement: $ => seq(
            /service/i,
            field('name', $.identifier),
            field('mixins', optional($.mixins)),
            field('members', $.node_object)
        ),

        // ResourceStatement =
        //     %s"resource" SP Identifier [Mixins] [WS] NodeObject
        resource_statement: $ => seq(
            /resource/i,
            field('name', $.identifier),
            field('mixins', optional($.mixins)),
            field('members', $.node_object)
        ),

        // OperationStatement =
        //     %s"operation" SP Identifier [Mixins] [WS] OperationBody
        operation_statement: $ => seq(
            /resource/i,
            field('name', $.identifier),
            field('mixins', optional($.mixins)),
            field('body', $.operation_body)
        ),

        // OperationBody =
        //     "{" [WS]
        //     *(OperationInput / OperationOutput / OperationErrors)
        //     [WS] "}"
        //     ; only one of each property can be specified.
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

        // OperationInput =
        //     %s"input" [WS] (InlineStructure / (":" [WS] ShapeId)) WS
        operation_input: $ => seq(
            /input/i,
            field(
                'type',
                choice(
                    $.inline_structure,
                    seq(
                        ':',
                        $.shape_id
                    )
                )
            )
        ),

        // OperationOutput =
        //     %s"output" [WS] (InlineStructure / (":" [WS] ShapeId)) WS
        operation_output: $ => seq(
            /output/i,
            field(
                'type',
                choice(
                    $.inline_structure,
                    seq(
                        ':',
                        $.shape_id
                    )
                )
            )
        ),

        // OperationErrors =
        //     %s"errors" [WS] ":" [WS] "[" *([WS] Identifier) [WS] "]" WS
        operation_errors: $ => seq(
            /errors/,
            ':',
            '[',
            repeat($.identifier),
            ']'
        ),

        // InlineStructure =
        //     ":=" [WS] TraitStatements [StructureResource]
        //          [Mixins] [WS] StructureMembers
        inline_structure: $ => seq(
            ':=',
            field('traits', repeat($.trait_statement)),
            field('resource', optional($._structure_resource)),
            field('mixins', optional($.mixins)),
            field('members', $._structure_members)
        ),

        // -------------------------------------------------------------------
        // Traits
        // -------------------------------------------------------------------

        // TraitStatements =
        //     *([WS] Trait) [WS]
        // Trait =
        //     "@" ShapeId [TraitBody]
        trait_statement: $ => seq(
            '@',
            field('type', $.shape_id),
            field('body', optional($.trait_body))
        ),

        // TraitBody =
        //     "(" [WS] [TraitBodyValue] [WS] ")"
        // TraitBodyValue =
        //     TraitStructure / NodeValue
        // TraitStructure =
        //     TraitStructureKvp *([WS] TraitStructureKvp)
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

        // TraitStructureKvp =
        //     NodeObjectKey [WS] ":" [WS] NodeValue
        trait_structure_kvp: $ => seq(
            field('key', $.node_object_key),
            ':',
            field('value', $.node_value)
        ),

        // ApplyStatement =
        //     ApplyStatementSingular / ApplyStatementBlock
        // ApplyStatementSingular =
        //     %s"apply" SP ShapeId WS Trait
        // ApplyStatementBlock =
        //     %s"apply" SP ShapeId WS "{" TraitStatements "}"
        apply_statement: $ => seq(
            /apply/i,
            field('target', $.shape_id),
            field(
                'traits',
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
            )
        ),

        // -------------------------------------------------------------------
        // Shape IDs
        // -------------------------------------------------------------------

        // ShapeId =
        //     RootShapeId [ShapeIdMember]
        shape_id: $ => token(
            SHAPE_ID
        ),

        // RootShapeId =
        //     AbsoluteRootShapeId / Identifier
        root_shape_id: $ => token(
            ROOT_ID
        ),

        // AbsoluteRootShapeId =
        //     Namespace "#" Identifier
        absolute_root_shape_id: $ => token(
            ABS_ROOT_ID
        ),

        // Namespace =
        //     Identifier *("." Identifier)
        namespace: $ => token(
            NAMESPACE
        ),

        // Identifier =
        //     IdentifierStart *IdentifierChars
        // IdentifierStart =
        //     (1*"_" (ALPHA / DIGIT)) / ALPHA
        // IdentifierChars =
        //     ALPHA / DIGIT / "_"
        identifier: $ => token(
            ID
        ),

        // ShapeIdMember =
        //     "$" Identifier
        shape_id_member: $ => token(
            MEMBER_ID
        ),
    }
});
