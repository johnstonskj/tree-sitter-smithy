$version: "2"

namespace example.treesitter.highlights

// "pattern" is a trait.
@pattern("^[A-Za-z0-9 ]+$")
// <- @attribute
//      ^ @punctuation.bracket
//       ^ @string
//                        ^ @punctuation.bracket
string SomeStringType
// <- @keyword.simple_type
//     ^ @type.definition

apply AnotherStringType @length(min: 1, max: 10)
// <- @keyword
//    ^ @type
//                      ^ @attribute
//                       ^ @attribute
//                             ^ @punctuation.bracket
//                              ^ @variable
//                                 ^ @punctuation.delimiter
//                                   ^ @number
//                                    ^ @punctuation.delimiter
//                                      ^ @variable
//                                         ^ @punctuation.delimiter
//                                           ^ @number
//                                             ^ @punctuation.bracket
