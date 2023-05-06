$version: "2"

namespace example.treesitter.highlights

use ex.test#shape

/// A Doc String.
@someTrait(
    input: "string"
    output: 100
    onDone: true
)
service SomeService {
    version: "2006-03-01"
    resources: [City]
    operations: [GetCurrentTime]
}

resource SomeResource {
    identifiers: { cityId: CityId }
    read: GetCity
    list: ListCities
    resources: [Forecast]
}


// "pattern" is a trait.
@pattern("^[A-Za-z0-9 ]+$")
string SomeStringType

apply MyString @length(min: 1, max: 10)

list SomeList {
member: CitySummary
}

enum SomeEnumeration {
    ONE
    TWO
}

map IntegercwHash {
    key: StringKey
    value: IntegerValue
}

@readonly
operation SomeOperation {
    @readonly
    input: GetCityInput
    output: GetCityOutput
    errors: [NoSuchResource]
}

@input
structure SomeStructure for SomeResource with [SomeMixin] {
    @required
    cityId: CityId
}

@output
union SomeUnion {
    @required
    name: String

    @required
    coordinates: CityCoordinates
}
