import { Request, Response, NextFunction, RequestHandler } from "express";
import { AnyZodObject } from "zod";

export const validate = (schema: AnyZodObject): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: "Validación fallida",
        errors: error.errors,
      });
    }
  };
};
