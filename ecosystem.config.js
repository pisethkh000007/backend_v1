const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env.production file
const envPath = path.resolve(__dirname, "src/configs/.env.production");
dotenv.config({ path: envPath });

module.exports = {
  apps: [
    {
      name: "my-app",
      script: "build/server.js",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        MONGODB_URL:
          "mongodb+srv://virakson444:12345@bootcamp-project.lwadf47.mongodb.net/auths",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT,
        MONGODB_URL: process.env.MONGODB_URL,
      },
    },
  ],
};
