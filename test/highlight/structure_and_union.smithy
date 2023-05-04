$version: "2"

namespace example.treesitter.highlights

@input
structure SomeStructure for SomeResource with [SomeMixin] {
// <- @keyword.aggregate_type
//        ^ @type.definition
//                      ^ @keyword
//                          ^ @type
//                                       ^ @keyword
//                                            ^ @punctuation.bracket
//                                             ^ @type
//                                                      ^ @punctuation.bracket
//                                                        ^ @punctuation.bracket

    @required
//  ^ @attribute
//   ^ @attribute
    cityId: CityId
    // <- @variable
    //    ^ @punctuation.delimiter
    //      ^ @type
}
// <- punctuation.bracket

@output
union SomeUnion {
// <- @keyword.aggregate_type
//    ^ @type.definition
//              ^ @punctuation.bracket

    @required
    name: String
    // <- @variable
    //  ^ @punctuation.delimiter
    //     ^ @type

    @required
//  ^ @attribute
//   ^ @attribute
    coordinates: CityCoordinates
    // <- @variable
    //         ^ @punctuation.delimiter
    //           ^ @type
}
// <- @punctuation.bracket
