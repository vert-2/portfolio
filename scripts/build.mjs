import { build, context } from "esbuild";

const options = {
  entryPoints: ["src/main.jsx"],
  bundle: true,
  format: "esm",
  jsx: "automatic",
  outfile: "assets/js/app.js",
  minify: true,
  legalComments: "external",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
};

if (process.argv.includes("--serve")) {
  const app = await context(options);
  await app.watch();
  await app.serve({ servedir: ".", host: "127.0.0.1", port: 5174 });
} else {
  await build(options);
}
