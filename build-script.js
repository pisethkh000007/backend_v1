//* V1
// const esbuild = require("esbuild");
// const { execSync } = require("child_process");

// // Collect environment variables from the current environment
// const envVars = {
//   MONGODB_URL: process.env.MONGODB_URL,
//   PORT: process.env.PORT,
//   NODE_ENV: process.env.NODE_ENV || "production",
// };

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

//* Success but no Ui api

// const esbuild = require("esbuild");
// const { execSync } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// // Determine the environment and set the appropriate .env file
// const env = process.env.NODE_ENV || "production";
// const envPath = path.resolve(__dirname, `./src/configs/.env.${env}`);
// if (!fs.existsSync(envPath)) {
//   console.error(
//     `.env.${env} not found. Please create the .env.${env} file in the configs directory.`
//   );
//   process.exit(1);
// }

// const envVars = {};
// const envContent = fs.readFileSync(envPath, "utf8");
// envContent.split("\n").forEach((line) => {
//   const [key, value] = line.split("=");
//   if (key && value) {
//     envVars[key.trim()] = value.trim();
//   }
// });

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
//       execSync("npx tsoa spec && npx tsoa routes", { stdio: "inherit" });
//       console.log("Swagger spec and routes generated successfully.");

//       // Copy the generated swagger.json and routes to the build directory using Node.js
//       const copyFiles = (srcDir, destDir) => {
//         if (!fs.existsSync(destDir)) {
//           fs.mkdirSync(destDir, { recursive: true });
//         }

//         fs.readdirSync(srcDir).forEach((file) => {
//           const srcFile = path.join(srcDir, file);
//           const destFile = path.join(destDir, file);
//           fs.copyFileSync(srcFile, destFile);
//         });
//       };

//       copyFiles("src/docs", "build/docs");
//       copyFiles("src/routes/v1", "build/routes/v1");
//       console.log("Swagger spec and routes copied to build directory.");
//     } catch (error) {
//       console.error("Error generating tsoa routes and spec:", error);
//       process.exit(1);
//     }
//   })
//   .catch((error) => {
//     console.error("Build failed:", error);
//     process.exit(1);
//   });

//* Successs

// const esbuild = require("esbuild");
// const path = require("path");
// const fs = require("fs-extra");
// const copy = require("esbuild-plugin-copy").default;

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
//     plugins: [
//       copy({
//         assets: {
//           from: [
//             "node_modules/swagger-ui-dist/*.css",
//             "node_modules/swagger-ui-dist/*.js",
//             "node_modules/swagger-ui-dist/*.png",
//           ],
//           to: ["./"],
//         },
//       }),
//     ],
//     resolveExtensions: [".ts", ".js"],
//     define: {
//       "process.env.NODE_ENV": '"production"',
//     },
//     alias: {
//       "@": path.resolve(__dirname, "."),
//     },
//   })
//   .then(() => {
//     fs.copySync(
//       path.resolve(__dirname, "src/docs/swagger.json"),
//       path.resolve(__dirname, "build/docs/swagger.json")
//     );
//     fs.copySync(
//       path.resolve(__dirname, "src/configs/.env.production"),
//       path.resolve(__dirname, "build/configs/.env.production")
//     );
//     console.log("Swagger JSON and .env.production copied successfully!");
//   })
//   .catch((error) => {
//     console.error("Build failed:", error);
//     process.exit(1);
//   });

//* Success v2

const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs-extra");
const copy = require("esbuild-plugin-copy").default;

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
    plugins: [
      copy({
        assets: {
          from: [
            "node_modules/swagger-ui-dist/*.css",
            "node_modules/swagger-ui-dist/*.js",
            "node_modules/swagger-ui-dist/*.png",
          ],
          to: ["./"],
        },
      }),
    ],
    resolveExtensions: [".ts", ".js"],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  })
  .then(() => {
    fs.copySync(
      path.resolve(__dirname, "src/docs/swagger.json"),
      path.resolve(__dirname, "build/docs/swagger.json")
    );
    // Removed copying of .env.production
    console.log("Swagger JSON copied successfully!");
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
