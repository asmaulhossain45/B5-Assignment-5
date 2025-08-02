/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { IErrorResponse, IErrorSources } from "../interfaces/error.types";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): IErrorResponse => {
  const errorSources: IErrorSources[] = [];
  const errors = Object.values(err.errors);

  errors.forEach((error: any) => {
    errorSources.push({
      path: error.path,
      message: error.message,
    });
  });

  const message = `Validation Error: ${err.message}`;

  return { statusCode: 400, message, errorSources };
};

export default handleValidationError;