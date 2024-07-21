const esbuild = require("esbuild");
const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
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
    try {
      execSync("npx tsoa spec && npx tsoa routes", { stdio: "inherit" });
      console.log("Swagger spec and routes generated successfully.");
    } catch (error) {
      console.error("Error generating tsoa spec and routes:", error);
      process.exit(1);
    }

    fs.copySync(
      path.resolve(__dirname, "src/docs/swagger.json"),
      path.resolve(__dirname, "build/docs/swagger.json")
    );

    const envPath = path.resolve(__dirname, "src/configs/.env.production");
    if (fs.existsSync(envPath)) {
      fs.copySync(
        envPath,
        path.resolve(__dirname, "build/configs/.env.production")
      );
      console.log(".env.production copied successfully!");
    } else {
      console.warn(
        ".env.production not found. Ensure it exists or is properly set up in your CI/CD environment."
      );
    }

    console.log("Build completed successfully!");
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
