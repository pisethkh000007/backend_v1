// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, './src/configs/.env.development') });
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, "src/configs/.env.development");
dotenv.config({ path: envPath });
