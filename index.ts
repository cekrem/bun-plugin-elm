import type { BunPlugin } from "bun";
import { join } from "node:path";

import { rm } from "node:fs/promises";

const plugin: BunPlugin = {
  name: "elm",
  setup(build) {
    build.onLoad({ filter: /\.elm$/ }, async ({ path }) => {
      const watchMode = !build.config.outdir;
      const output = join(process.cwd(), "elm-stuff/output.js");
      await rm(output, { force: true });

      const elmMake = Bun.spawn(
        ["bunx", "elm", "make", path, "--optimize", `--output=${output}`],
        { stdout: "inherit", stderr: "inherit" },
      );
      const exitCode = await elmMake.exited;
      if (exitCode > 0 && !watchMode) {
        process.exit(exitCode);
      }

      // region watch mode only:
      if (!build.config.outdir) {
        const watchFile = join(process.cwd(), "elm-watch.json");

        if (!(await Bun.file(watchFile).exists())) {
          console.log("creating elm-watch config file...");
          await Bun.write(
            watchFile,

            `{
    "targets": {
        "Elm Main": {
            "inputs": [
                "${path}"
            ],
            "output": "${output}"
        }
    }
}`,
          );
        }

        const elmWatch = Bun.spawn(["bunx", "elm-watch", "hot"], {
          stdout: null, // don't pollute console when all is a-ok
          stderr: "inherit",
        });

        process.on("SIGINT", () => {
          elmWatch.kill();
          process.exit(0);
        });
      }
      // endregion

      return {
        contents: `export { Elm } from "${output}";`,
        loader: "js",
      };
    });
  },
};

export default plugin;
