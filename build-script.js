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
const { execSync } = require("child_process");

// Generate tsoa routes and spec
try {
  execSync("yarn tsoa:gen", { stdio: "inherit" });
} catch (error) {
  console.error("Error generating tsoa routes and spec:", error);
  process.exit(1);
}

// Build with esbuild
esbuild
  .build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    outdir: "build",
    external: ["express"],
    loader: {
      ".ts": "ts",
    },
    resolveExtensions: [".ts", ".js"],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  })
  .then(() => {
    // Copy the generated swagger.json to the build/docs directory
    const buildDocsDir = path.join(__dirname, "build", "docs");
    if (!fs.existsSync(buildDocsDir)) {
      fs.mkdirSync(buildDocsDir, { recursive: true });
    }
    fs.copyFileSync(
      path.join(__dirname, "src", "docs", "swagger.json"),
      path.join(buildDocsDir, "swagger.json")
    );

    // Copy the .env.development file to the build directory
    const envSrcPath = path.join(
      __dirname,
      "src",
      "configs",
      ".env.development"
    );
    const envDestPath = path.join(__dirname, "build", ".env.development");
    fs.copyFileSync(envSrcPath, envDestPath);

    // Log the copied environment variables
    const copiedEnv = fs.readFileSync(envDestPath, "utf-8");
    console.log("Copied environment variables:\n", copiedEnv);

    console.log("Build succeeded.");
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
