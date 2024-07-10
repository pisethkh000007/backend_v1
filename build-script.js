//* V1
// const esbuild = require("esbuild");
// const path = require("path");

// esbuild
//   .build({
//     entryPoints: ["src/server.ts"],
//     bundle: true,
//     platform: "node",
//     target: "node20", // Target depends on your environment
//     outdir: "build",
//     external: ["express"], // Specify Node.js packages here
//     loader: {
//       ".ts": "ts",
//     },
//     resolveExtensions: [".ts", ".js"],
//     define: {
//       "process.env.NODE_ENV": '"production"',
//     },
//   })
//   .catch((error) => {
//     console.error("Build failed:", error);
//     process.exit(1);
//   });

//* V2

const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

// Load environment variables
const envPath = path.resolve(__dirname, "src/configs/.env.development");
require("dotenv").config({ path: envPath });

console.log(
  "Copied environment variables:\n",
  fs.readFileSync(envPath, "utf8")
);

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    target: "node20", // Target depends on your environment
    outdir: "build",
    external: ["express"], // Specify Node.js packages here
    loader: {
      ".ts": "ts",
    },
    resolveExtensions: [".ts", ".js"],
    define: {
      "process.env.NODE_ENV": '"production"',
      "process.env.PORT": `"${process.env.PORT}"`,
      "process.env.MONGODB_URL": `"${process.env.MONGODB_URL}"`,
    },
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
