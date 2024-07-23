module.exports = {
  apps: [
    {
      name: "my-app",
      script: "build/server.js",
      env: {
        NODE_ENV: "development",
        PORT: process.env.PORT,
        MONGODB_URL: process.env.MONGODB_URL,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT,
        MONGODB_URL: process.env.MONGODB_URL,
      },
    },
  ],
};
