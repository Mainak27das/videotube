import express from "express";
import { sendError, sendSuccess } from "./utils/response.util.js";
import healthCheckroute from "./routes/healthcheck.routes.js";

const app = express();

// middleware
app.use(express.json());

// health check route
// app.get("/healthcheck", (req, res) => {
//  return sendError(res, 500 , "Server is not working 🙌🙌");
// });

app.use("/", healthCheckroute);
app.use("/user", healthCheckroute);
app.use("/admin", healthCheckroute);

export default app;
