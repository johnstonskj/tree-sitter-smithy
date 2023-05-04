$version: "2"

namespace example.treesitter.highlights

/// A Doc String.
// <- @comment
@someTrait(
// <- @attribute
//        ^ @punctuation.bracket

    input: "string"
    // <- @variable
    //   ^ @punctuation.delimiter
    //     ^ @string

    output: 100
    // <- @variable
    //    ^ @punctuation.delimiter
    //      ^ @number

    onDone: true
    // <- @variable
    //    ^ @punctuation.delimiter
    //      ^ @constant.builtin
)
// <- @punctuation.bracket
service SomeService {
// <- @keyword.service_type
//      ^ @type.definition
//                  ^ @punctuation.bracket

    version: "2006-03-01"
    // <- @variable
    //     ^ @punctuation.delimiter
    //       ^ @string

    resources: [City]
    // <- @variable
    //       ^ @punctuation.delimiter
    //         ^ @punctuation.bracket
    //          ^ @type
    //              ^ @punctuation.bracket

    operations: [GetCurrentTime]
    // <- @variable
    //        ^ @punctuation.delimiter
    //          ^ @punctuation.bracket
    //           ^ @type
    //                         ^ @punctuation.bracket
}
// <- @punctuation.bracket
