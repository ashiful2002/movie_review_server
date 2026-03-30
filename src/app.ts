import express, { Application, Request, Response } from "express";
import cors from "cors";

import router from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("MMDB movie rateing platform");
});

app.use(notFound);
app.use(errorHandler);

export default app;
