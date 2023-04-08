//PACKAGES
import express from "express";
import { mongo } from "./src/config/db.js";
import path from "path";

import router from "./src/routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 8000;

//routes
app.use("/api", router);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const dbName = "jobdb";
const dbUrl = process.env.DB_URL || `mongodb://0.0.0.0:27017/${dbName}`;
mongo(dbUrl);

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
