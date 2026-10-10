import { createUser , findUserByEmail , findUserById } from '../repositories/userRepository.js';
import ApiError from '../utils/ApiError.js';
import { signToken } from '../utils/token.js';


export async function registerUser(input: {
    name: string,
    email: string,
    password: string
}){
    const existingUser = await findUserByEmail(input.email)

    if (existingUser){
        throw new ApiError(409 , "email already registered")
    }

    const user = await createUser(input)
    const token = signToken(user.id)

    return { user, token }
}

export async function loginUser(input:{
    email:string,
    password:string
}){
    const user = await findUserByEmail(input.email)
    const isMatch = await user?.comparePassword(input.password)

    if(!user || !isMatch){
        throw new ApiError(401, "Invalid email or password")
    }

    const token = signToken(user.id)
    return { user, token }
}


export async function getCurrentUser(userId: string){
    const user = await findUserById(userId)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    return user
}