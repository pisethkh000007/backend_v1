import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/v1/routes";
import fs from "fs";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";

// Initialize App Express
const app = express();

// Global Middleware
app.use(express.json()); // Help to get the json from request body

// Serve Swagger UI static files
const swaggerUiAssetPath = path.join(
  __dirname,
  "../node_modules/swagger-ui-dist"
);
app.use("/api-docs", express.static(swaggerUiAssetPath));

// Dynamically load swagger.json
const swaggerPath = path.join(__dirname, "docs/swagger.json");
console.log(`Loading Swagger document from: ${swaggerPath}`);
let swaggerDocument;

try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
  console.log("Swagger document loaded successfully.");
} catch (error) {
  console.error("Failed to load Swagger document:", error);
}

// API Documentations
if (swaggerDocument) {
  console.log("Setting up Swagger UI.");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.error("Swagger document is not available.");
}

// Global API V1
RegisterRoutes(app);

// ERROR Handler
app.use(errorHandler);

export default app;
