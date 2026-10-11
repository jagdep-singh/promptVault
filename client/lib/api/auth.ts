import { api , TOKEN_KEY } from './client'
import type {
    AuthResponse,
    LoginInput,
    SignupInput,
    User
} from "./types"

export async function signup(input:SignupInput): Promise<AuthResponse>{
    const {data} = await api.post<AuthResponse>("/auth/signup",input)

    localStorage.setItem(TOKEN_KEY , data.token)

    return data
}

export async function login(input:LoginInput): Promise<AuthResponse>{
    const {data} = await api.post<AuthResponse>("/auth/login",input)

    localStorage.setItem(TOKEN_KEY , data.token)

    return data
}

export async function getCurrentUser(): Promise<User>{
    const {data} = await api.get<User>("/auth/me")

    return data
}

export function logout(): void{
    localStorage.removeItem(TOKEN_KEY)
}
