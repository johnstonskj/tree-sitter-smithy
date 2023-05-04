$version: "2"

namespace example.treesitter.highlights

list SomeList {
// <- @keyword.aggregate_type
//   ^ @type.definition
//            ^ @punctuation.bracket

    member: CitySummary
    // <- @variable
    //    ^ @punctuation.delimiter
    //      ^ @type
}
// <- @punctuation.bracket

map IntegerMap {
// <- @keyword.aggregate_type
//  ^ @type.definition
//             ^ @punctuation.bracket

    key: StringKey
    // <- @variable
    // ^ @punctuation.delimiter
    //   ^ type

    value: IntegerValue
    // <- @variable
    //   ^ @punctuation.delimiter
    //     ^ type
}
// <- @punctuation.bracket
