import { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "This route is not available...",
    path: req.originalUrl,
    date: Date(),
  });
};
