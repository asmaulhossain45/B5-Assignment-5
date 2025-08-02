/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { envConfig } from "../configs/envConfig";
import handleCastError from "../helpers/handleCastError";
import handleDuplicateError from "../helpers/handleDuplicateError";
import { IErrorSources } from "../interfaces/error.types";
import handleZodError from "../helpers/handleZodError";
import handleValidationError from "../helpers/handleValidationError";
import { NodeEnv } from "../constants/enums";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errorSources: any = [];
  let message = "Something went wrong!";

  // Mongoose Duplicate Error
  if (err.code === 11000) {
    const errorInfo = handleDuplicateError(err);
    statusCode = errorInfo.statusCode;
    message = errorInfo.message;
  }

  // Mongoose Cast Error or ObjectId Error
  else if (err.name === "CastError") {
    const errorInfo = handleCastError(err);
    statusCode = errorInfo.statusCode;
    message = errorInfo.message;
  }

  // Zod Error
  else if (err.name === "ZodError") {
    const errorInfo = handleZodError(err);
    statusCode = errorInfo.statusCode;
    message = errorInfo.message;
    errorSources = errorInfo.errorSources as IErrorSources[];
  }

  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const errorInfo = handleValidationError(err);
    statusCode = errorInfo.statusCode;
    message = errorInfo.message;
    errorSources = errorInfo.errorSources as IErrorSources[];
  }

  // Custom App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Generic Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    succcess: false,
    message,
    errorSources,
    err: envConfig.NODE_ENV === NodeEnv.DEVELOPMENT ? err : null,
    stack: envConfig.NODE_ENV === NodeEnv.DEVELOPMENT ? err.stack : null,
  });
};

export default globalErrorHandler;
