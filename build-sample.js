import elmPlugin from "./index.ts";

const result = await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: "./dist",
  plugins: [elmPlugin],
});

if (!result.success) {
  console.error(result.logs);
  process.exit(1);
}
