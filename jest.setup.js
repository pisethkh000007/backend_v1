const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, "./src/configs/.env.test");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("Error loading .env.test file:", result.error);
} else {
  console.log("Environment variables loaded successfully:");
  console.log("MONGODB_URL:", process.env.MONGODB_URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("PORT:", process.env.PORT);
}
