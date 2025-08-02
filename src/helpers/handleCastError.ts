import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces/error.types";

const handleCastError = (err: mongoose.Error.CastError): IErrorResponse => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return {
    statusCode: 400,
    message,
  };
};

export default handleCastError;
