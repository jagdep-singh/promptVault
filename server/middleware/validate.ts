import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'
import ApiError from '../utils/ApiError.js'

export default function validate(schema: ZodType){
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)

        if(!result.success){
            const errors = result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
            return next(new ApiError(400, "Validation error", errors))
        }

        req.body = result.data
        next()
    }
}
