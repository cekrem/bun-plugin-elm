# Bun plugin for Elm modules

This simple plugin let's you `import { Elm } from "src/Main.elm"` like nobody's business. Natively supports Hot Module Reloading (`elm-watch hot`) out of the box when serving, and does ordinary (optimized) build when not.

## Installation

`bun add --dev bun-plugin-elm`

and then add it to the plugins array in your build file like this:

```js
import elmPlugin from "bun-plugin-elm";

const result = await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: "./dist",
  plugins: [elmPlugin], // This right here. 🤤
});
```

To make it Just Work™ when serving (either via JS `Bun.serve(...)`, or just `bun src/index.html`), add this line to your `bunfig.toml`:
plugins = ["./index.ts"]

```toml
[serve.static]
plugins = ["bun-plugin-elm"]
```

Made by hand, btw (I feel like I need to specify these days...)
