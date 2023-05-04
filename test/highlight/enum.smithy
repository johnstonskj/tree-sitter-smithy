$version: "2"

namespace example.treesitter.highlights

enum SomeEnumeration {
// <- @keyword.simple_type
//   ^ @type.definition
//                   ^ @punctuation.bracket

    ONE
    // <- @constructor

    TWO = "Two"
    // <- @constructor
    //  ^ @operator
    //    ^ @string
}
// <- punctuation.bracket


intEnum SomeEnumeration {
// <- @keyword.simple_type
//      ^ @type.definition
//                      ^ @punctuation.bracket

    ONE,
    // <- @constructor
    // ^ @punctuation.delimiter

    TWO = 2,
    // <- @constructor
    //  ^ @operator
    //    ^ @number
    //     ^ @punctuation.delimiter
}
// <- @punctuation.bracket
