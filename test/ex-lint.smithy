$version: "2.0"

use ex.test#shape

/// A Doc String.
@SomeTrait(
    Input: "string"
)
service someService {
    version: ""
    Resources: [City]
    functions: []
}

apply MyString @Length(Min: 1, Max: 10)

enum SomeEnumeration {
    oNE
    TWO
}
