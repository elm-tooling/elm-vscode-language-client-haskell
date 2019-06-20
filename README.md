[![Build Status](https://dev.azure.com/razzeee/elm-tooling/_apis/build/status/elm-tooling.elm-vscode-language-client)](https://dev.azure.com/razzeee/elm-tooling/_build/latest?definitionId=1)

# elm-vscode-language-client-haskell (archived)

**NOTE:** This plugin is deprecated in favour of [elm-language-client-vscode](https://github.com/elm-tooling/elm-language-client-vscode).

---

This vscode extension is in development and might be lacking features you know working from `vscode-elm`.

## Features

- Diagnostics

![diagnostics](images/diagnostics.gif)

## Requirements

You will need to have an executable of this repo on your path https://github.com/elm-tooling/elm-language-server
Just open the repo and follow those instructions, for now. We will prebuild the binarys at a later point in time.

## Extension Settings
This extension contributes the following settings:

* `elmLS.trace.server`: enable/disable trace logging of client and server communication
