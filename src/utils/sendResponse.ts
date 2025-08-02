import { Response } from "express";

interface TMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: TMeta;
  data?: T;
}

const sendResponse = <T>(res: Response, response: TResponse<T>) => {
  const { statusCode, success, message, data, meta } = response;
  res.status(statusCode).json({
    statusCode,
    message,
    success,
    data,
    meta,
  });
};

export default sendResponse;
