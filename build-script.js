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

// const esbuild = require("esbuild");
// const path = require("path");
// const fs = require("fs");
// const { execSync } = require("child_process");

// // Load environment variables from .env.production file
// const envPath = path.resolve(__dirname, `./src/configs/.env.production`);
// const env = fs.readFileSync(envPath, "utf8");
// const envVars = env
//   .split("\n")
//   .map((line) => line.trim())
//   .filter((line) => line && !line.startsWith("#"))
//   .reduce((acc, line) => {
//     const [key, value] = line.split("=");
//     acc[key] = value;
//     return acc;
//   }, {});

// // Copy environment variables to the build environment
// console.log("Copied environment variables:");
// console.log(envVars);

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
//       ...Object.fromEntries(
//         Object.entries(envVars).map(([key, value]) => [
//           `process.env.${key}`,
//           `"${value}"`,
//         ])
//       ),
//     },
//   })
//   .then(() => {
//     console.log("Build succeeded.");
//     try {
//       execSync("tsoa spec && tsoa routes", { stdio: "inherit" });
//     } catch (error) {
//       console.error("Error generating tsoa routes and spec:", error);
//       process.exit(1);
//     }
//   })
//   .catch((error) => {
//     console.error("Build failed:", error);
//     process.exit(1);
//   });

// const esbuild = require("esbuild");
// const path = require("path");
// const fs = require("fs");
// const { execSync } = require("child_process");

// // Load environment variables from .env.production file
// const envPath = path.resolve(__dirname, `./configs/.env.production`);
// const env = fs.readFileSync(envPath, "utf8");
// const envVars = env
//   .split("\n")
//   .map((line) => line.trim())
//   .filter((line) => line && !line.startsWith("#"))
//   .reduce((acc, line) => {
//     const [key, value] = line.split("=");
//     acc[key] = value;
//     return acc;
//   }, {});
//   ///

// // Copy environment variables to the build environment
// console.log("Copied environment variables:");
// console.log(envVars);

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
//       ...Object.fromEntries(
//         Object.entries(envVars).map(([key, value]) => [
//           `process.env.${key}`,
//           `"${value}"`,
//         ])
//       ),
//     },
//   })
//   .then(() => {
//     console.log("Build succeeded.");
//     try {
//       execSync("tsoa spec && tsoa routes", { stdio: "inherit" });
//     } catch (error) {
//       console.error("Error generating tsoa routes and spec:", error);
//       process.exit(1);
//     }
//   })
//   .catch((error) => {
//     console.error("Build failed:", error);
//     process.exit(1);
//   });

const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

// Function to load environment variables from a file
const loadEnvVariables = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const env = fs.readFileSync(filePath, "utf8");
  return env
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce((acc, line) => {
      const [key, value] = line.split("=");
      acc[key] = value;
      return acc;
    }, {});
};

// Try to load .env.production, fallback to .env.development if it does not exist
const envPath = path.resolve(__dirname, `./src/configs/.env.production`);
const fallbackEnvPath = path.resolve(__dirname, `./src/configs/.env.development`);
let envVars = loadEnvVariables(envPath);

if (!envVars) {
  console.warn(`.env.production not found, falling back to .env.development`);
  envVars = loadEnvVariables(fallbackEnvPath);

  if (!envVars) {
    console.error(
      `No environment file found. Please create .env.production or .env.development in the configs directory.`
    );
    process.exit(1);
  }
}

// Copy environment variables to the build environment
console.log("Copied environment variables:");
console.log(envVars);

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
      ...Object.fromEntries(
        Object.entries(envVars).map(([key, value]) => [
          `process.env.${key}`,
          `"${value}"`,
        ])
      ),
    },
  })
  .then(() => {
    console.log("Build succeeded.");
    try {
      execSync("tsoa spec && tsoa routes", { stdio: "inherit" });
    } catch (error) {
      console.error("Error generating tsoa routes and spec:", error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
