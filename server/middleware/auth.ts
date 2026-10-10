import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js'

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export default function auth(
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
) {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')

    if(scheme !== "Bearer" || !token) {
        return next(new ApiError(401, 'Unauthorized'))
    }

    try{
        const payload = jwt.verify(token , process.env.JWT_SECRET!) 
        if(typeof payload.sub !== 'string'){
            throw new ApiError(401, 'invalid token')
        }

        req.user = { id: payload.sub }
        next()
    }catch(err){
        return next(new ApiError(401, 'invalid or expired token'))
    }
}