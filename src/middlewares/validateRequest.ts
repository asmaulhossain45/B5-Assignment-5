import { ZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (typeof req.body.data === "string") {
        try {
          req.body = JSON.parse(req.body.data);
        } catch (error) {
          return next(error);
        }
      }

      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
