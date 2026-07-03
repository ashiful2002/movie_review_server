import express, { Application, Request, Response } from "express";
import cors from "cors";

import router from "./app/routes";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { globalErrorHandller } from "./app/middlewares/globalErrorHandler";

const app: Application = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mm-db.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
 

app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());

// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("MMDB movie rateing platform");
});

app.use(globalErrorHandller);
app.use(notFound);

export default app;
