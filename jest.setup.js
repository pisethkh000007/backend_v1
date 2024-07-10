// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, './src/configs/.env.development') });

const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, "src/configs/.env.development");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Environment variables loaded successfully:", process.env);
}
