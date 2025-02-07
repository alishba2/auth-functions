
import { SuccessResponse, ErrorResponse } from "../interfaces/response";
import { Response, Request, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

export const sendSuccess = <T>(res: Response, status: number, message: string, data?: T) => {
  const response: SuccessResponse<T> = { success: true, status, message, data };
  return res.status(status).json(response);
};

export const sendError = (res: Response, status: number, error: string, details?: unknown) => {
  const response: ErrorResponse = { success: false, status, error, details , };
  return res.status(status).json(response);
};

export const asyncHandler = <T>(
    cb: (req: Request, res: Response, next: NextFunction) => T
  ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await cb(req, res, next);
      } catch (error: any) {
        let status =
          error?.status || (error instanceof JsonWebTokenError ? 401 : 500);
  
        let message = error?.message || "Internal Server Error";
  
        res.status(status).send({ message });
  
        console.log("🚀 ~ file: asyncHandler.ts:19 ~ error:", error);
      }
    };
  };