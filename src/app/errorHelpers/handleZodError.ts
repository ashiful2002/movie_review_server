import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";
 
export const handleZodError = (err: z.ZodError): TErrorResponse => {
  let statusCode = status.BAD_REQUEST;
  let message = "Zod Validation Error";
  let errorSources: TErrorSource[] = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSources,
    statusCode,
  };
};
