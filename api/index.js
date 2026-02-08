import connectDB from "../src/config/db.js";
import app from "../src/app.js";

let isConnected = false;

async function dbMiddleware(req, res, next) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
}

app.use(dbMiddleware);

export default app;
