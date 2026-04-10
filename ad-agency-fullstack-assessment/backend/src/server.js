import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { campaignRouter } from "./routes/campaigns.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(apiRateLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRouter);
app.use("/campaigns", campaignRouter(io));
app.use(errorHandler);

const port = Number(process.env.PORT || 3001);
httpServer.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

