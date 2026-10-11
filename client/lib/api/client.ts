import axios from "axios"

export const TOKEN_KEY="promptvault_token"

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use((config)=> {
    if(typeof window !== "undefined"){
        const token = localStorage.getItem(TOKEN_KEY)

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

api.interceptors.response.use((response)=> response,
(error)=>{
    const msg = error.response?.data?.message ?? error.message ?? "something went wrong"

    return Promise.reject(new Error(msg))
})

