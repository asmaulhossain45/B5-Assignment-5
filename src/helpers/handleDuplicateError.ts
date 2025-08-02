/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorResponse } from "../interfaces/error.types";

const handleDuplicateError = (err: any): IErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  const message = `${matchedArray?.[1]} already exists`;
  return {
    statusCode: 400,
    message,
  };
};

export default handleDuplicateError;
