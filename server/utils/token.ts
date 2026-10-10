import jwt from 'jsonwebtoken';

export function signToken(userId: string): string {
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error('no JWT_SECRET in .env')
    }

    return jwt.sign(
        { sub: userId }, 
        secret, 
        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d')as jwt.SignOptions['expiresIn'] }
    )
}