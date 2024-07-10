// import app from "./app";
// import configs from "./utils/config";
// import { connectDB } from "./database";
// connectDB();
// function run() {
//   app.listen(configs.port, () => {
//     console.log(`User Service running on Port: ${configs.port}`);
//   });
// }

// run();

import dotenv from "dotenv";
import path from "path";

// Determine the environment and set the appropriate .env file
const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `.env.${env}`);
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

connectDB();

function run() {
  app.listen(configs.port, () => {
    console.log(`User Service running on Port: ${configs.port}`);
  });
}

run();
