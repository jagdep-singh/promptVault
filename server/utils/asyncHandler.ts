import type { Request, Response, NextFunction } from 'express'

type AsyncRoute = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>

export const asyncHandler = (fn: AsyncRoute) => (
    req: Request, 
    res: Response,
    next: NextFunction
    ) => {
        Promise.resolve(fn(req, res, next)).catch(next)
}