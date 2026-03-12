import { Request, Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  data?: T;
};
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, success, message, meta, data: responseData } = data;

  res.status(statusCode).json({
    success,
    message,
    ...(meta && { meta }),
    ...(responseData && { data: responseData }),
  });
};

export default sendResponse;
