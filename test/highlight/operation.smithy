$version: "2"

namespace example.treesitter.highlights

@readonly
operation SomeOperation {
// <- @keyword.service_type
//        ^ @type.definition
//                      ^ @punctuation.bracket

    @readonly
//  ^ @attribute
//   ^ @attribute
    input: GetCityInput
    // <- @variable
    //   ^ @punctuation.delimiter
    //     ^ @type

    output := @inline for Resource with [Mixin] {
    // <- @variable
    //     ^ @operator
    //        ^ @attribute
    //         ^ @attribute
    //                ^ keyword
    //                    ^ type
    //                             ^ keyword
    //                                  ^ punctuation.bracket
    //                                   ^ type
    //                                        ^ punctuation.bracket

@required
//  ^ attribute
//   ^ attribute
        cityId: CityId
        // <- @variable
        //    ^ @punctuation.delimiter
        //      ^ @type
    }

    errors: [NoSuchResource]
    // <- @variable
    //    ^ @punctuation.delimiter
    //      ^ @punctuation.bracket
    //       ^ @type
    //                     ^ @punctuation.bracket
}
// <- punctuation.bracket
