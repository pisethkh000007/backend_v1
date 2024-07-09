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
