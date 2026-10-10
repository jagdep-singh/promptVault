
import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/ApiError.js"

export default function errorHandler(
  err: Error & { status?: number; errors?:[]; code?: number },
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = err.status || 500
  let message = err.message || "Something went wrong"

  if (err.code === 11000) {
    status = 409
    message = "Email is already registered"
  }

  if (status === 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error"
  }

  if (status === 500) console.error(err)

  res.status(status).json({
    success: false,
    message,
    ...(err instanceof ApiError && err.errors
      ? { errors: err.errors }
      : {}),
  })
}
