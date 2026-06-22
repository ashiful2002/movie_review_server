import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const pardesResult = zodSchema.safeParse(req.body);

    if (!pardesResult.success) {
      next(pardesResult.error);
    }
    req.body = pardesResult.data;
    next();
  };
};
