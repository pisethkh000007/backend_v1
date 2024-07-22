module.exports = {
  apps: [
    {
      name: "my-app",
      script: "build/server.js", // Adjust this path if necessary
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_URL:
          "mongodb+srv://virakson444:12345@bootcamp-project.lwadf47.mongodb.net/auths",
      },
    },
  ],
};
