$version: "2"

namespace example.treesitter.highlights

resource SomeResource {
// <- @keyword.service_type
//       ^ @type.definition
//                    ^ @punctuation.bracket

    identifiers: { cityId: CityId }
    // <- variable
    //         ^ @punctuation.delimiter
    //           ^ @punctuation.bracket
    //             ^ @variable
    //                   ^ @punctuation.delimiter
    //                     ^ @type
    //                            ^ @punctuation.bracket

    read: GetCity
    // <- @variable
    //  ^ @punctuation.delimiter
    //    ^ @type

    list: ListCities
    // <- @variable
    //  ^ @punctuation.delimiter
    //    ^ @type

    resources: [Forecast]
    // <- @variable
    //       ^ @punctuation.delimiter
    //         ^ @punctuation.bracket
    //          ^ @type
    //                  ^ @punctuation.bracket
}
// <- @punctuation.bracket
