import dotenv from "dotenv";
import path from "path";
import * as yup from "yup";

// Load environment variables
const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `../configs/.env.${env}`);
dotenv.config({ path: envPath });

// Log the current environment variables
console.log("Loaded environment variables:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
});

// Define a schema for the environment variables using yup
const envVarsSchema = yup.object().shape({
  NODE_ENV: yup
    .string()
    .oneOf(["development", "production", "test"])
    .default("development"),
  PORT: yup.number().default(3000),
  MONGODB_URL: yup.string().required("MONGODB_URL is a required field"),
});

// Validate the environment variables
let envVars;
try {
  envVars = envVarsSchema.validateSync(process.env, { stripUnknown: true });
  console.log("Validated environment variables:", envVars);
} catch (error) {
  console.error("Config validation error:", error);
  throw new Error(`Config validation error: ${error}`);
}

const configs = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongodbUrl: envVars.MONGODB_URL,
};

export default configs;
