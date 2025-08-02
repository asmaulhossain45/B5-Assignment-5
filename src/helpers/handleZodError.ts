/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorResponse, IErrorSources } from "../interfaces/error.types";

const handleZodError = (err: any): IErrorResponse => {
  const errorSources: IErrorSources[] = [];

  err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  const message = "Zod validation error";

  return { statusCode: 400, message, errorSources };
};

export default handleZodError;