import dotenv from "dotenv";
import path from "path";

// Determine the environment and set the appropriate .env file
const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `../configs/.env.${env}`);
dotenv.config({ path: envPath });

// Log the environment variables to verify they are loaded
console.log("Loaded environment variables:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
});

import app from "./app";
import configs from "./utils/config";
import { connectDB } from "./database";

// Ensure all necessary environment variables are defined
if (!process.env.MONGODB_URL) {
  console.error("MONGODB_URL is a required field");
  process.exit(1);
}
if (!process.env.PORT) {
  console.error("PORT is a required field");
  process.exit(1);
}

connectDB();

function run() {
  app.listen(configs.port, () => {
    console.log(`User Service running on Port: ${configs.port}`);
  });
}

run();
