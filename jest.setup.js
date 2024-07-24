// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, './src/configs/.env.development') });

// const dotenv = require("dotenv");
// const path = require("path");

// const envPath = path.resolve(__dirname, "src/configs/.env.development");
// const result = dotenv.config({ path: envPath });

// if (result.error) {
//   console.error("Error loading .env file:", result.error);
// } else {
//   console.log("Environment variables loaded successfully:", process.env);
// }

process.env.PORT = "3000";
process.env.MONGODB_URL =
  "mongodb+srv://pisethsann50:2oeRnCALccYC1ssM@bootcamp-project.h4sdiy1.mongodb.net/auths";

console.log("MONGODB_URL:", process.env.MONGODB_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
