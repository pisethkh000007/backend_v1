<<<<<<< HEAD
import app from "../src/app";
import configs from "../src/utils/config";
import { connectDB } from "./database";

=======
import dotenv from "dotenv";
import path from "path";

// Load environment variables
const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `../configs/.env.${env}`);
dotenv.config({ path: envPath });

// Log the environment variables to verify they are loaded
console.log("Loaded environment variables:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
});

// Ensure all necessary environment variables are defined
if (!process.env.MONGODB_URL) {
  console.error("MONGODB_URL is a required field");
  process.exit(1);
}
if (!process.env.PORT) {
  console.error("PORT is a required field");
  process.exit(1);
}

import app from "./app";
import configs from "./utils/config";
import { connectDB } from "./database";

>>>>>>> ab45197f059e180a3f294519f175db17305be035
connectDB();
function run() {
  app.listen(configs.port, () => {
    console.log(`User Service running on Port: ${configs.port}`);
  });
}

run();
