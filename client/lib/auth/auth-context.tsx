"use client"

import {createContext , useCallback , useContext , useEffect , useState , type ReactNode} from "react"
import { TOKEN_KEY } from '@/lib/api/client'
import { getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
    signup as signupRequest
} from "@/lib/api/auth"
import type {LoginInput, SignupInput, User} from "@/lib/api/types"
import { logout } from '../api/auth';

export interface AuthContextValue{
    user: User | null
    isLoading: boolean
    login: (input: LoginInput) => Promise<void>
    signup: (input: SignupInput) => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({children} : {children: ReactNode}){
    const [user , setUser] = useState<User | null>(null)
    const [isLoading , setIsLoading] = useState(true)

    const refreshUser = useCallback(async() => {
        const token = localStorage.getItem(TOKEN_KEY)

        if(!token){
            setUser(null)
            setIsLoading(false)
            return
        }

        try{
            const currentUser = await getCurrentUser()
            setUser(currentUser)
        }catch{
            localStorage.removeItem(TOKEN_KEY)
            setUser(null)
        }

        setIsLoading(false)
    },[]);

    useEffect(()=>{
        const timeoutId = window.setTimeout(() => {
            void refreshUser()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    },[refreshUser])

    const login = useCallback(async(input:LoginInput)=>{
        const response = await loginRequest(input)
        setUser(response.user)
    },[])

    const signup = useCallback(async(input: SignupInput)=>{
        const response = await signupRequest(input)
        setUser(response.user)
    },[])

    const logout = useCallback(async ():Promise<void> =>{
        logoutRequest()
        setUser(null)
    },[])

    return(
        <AuthContext.Provider
            value={{user , isLoading , login , signup , logout , refreshUser}}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)

    if(!context){
        throw new Error("useAuth should be in AuthProvider... maybe idk")
    }

    return context
}
