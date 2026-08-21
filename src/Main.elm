module Main exposing (main)

import Html exposing (Html)
import OtherModule


main : Html msg
main =
    Html.text OtherModule.greeting
