export type PromptTool = "code0" | "chatgpt" | "claude" | "copilot"| "opencode" | "other"

export interface User{
    id:string
    name:string
    email:string
    createdAt?:string
    updatedAt?:string
}

export interface AuthResponse{
    user:User
    token:string
}

export interface Prompt{
    id:string
    title:string
    content:string
    tags:string[]
    tool:PromptTool
    isPinned:boolean
    usedCount:number
    createdAt:string
    updatedAt:string
}

export interface PromptPagination{
    page:number
    limit:number
    total:number
    totalPages:number
}

export interface PromptListResponse{
    prompts:Prompt[]
    pagination:PromptPagination
}

export interface PromptResponse{
    data:Prompt
}

export interface TagsResponse{
    tags:string[]
}

export interface ApiErrorResponse{
    success?:false
    message:string
    errors?:Array<{
                field:string
                message:string
            }>
}

export interface SignupInput{
    name:string
    email:string
    password:string
}

export interface LoginInput{
    email:string
    password:string
}

export interface CreatePromptInput{
    title:string
    content:string
    tags?:string[]
    tool?:PromptTool
}

export type UpdatePromptInput = Partial<CreatePromptInput>

export interface ListPromptsParams{
    search?:string
    tags?:string
    sort?:"pinned"|"recent"|"used"
    page?:number
    limit?:number
}
