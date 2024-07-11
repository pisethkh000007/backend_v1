//* V1
const esbuild = require("esbuild");
const { execSync } = require("child_process");

// Collect environment variables from the current environment
const envVars = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || "production",
};

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
