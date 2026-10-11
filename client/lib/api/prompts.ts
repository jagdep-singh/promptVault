import {api} from "./client"
import type {
    CreatePromptInput,
    ListPromptsParams,
    PromptListResponse,
    PromptResponse,
    TagsResponse,
    UpdatePromptInput
} from "./types"

export async function listPrompts(params: ListPromptsParams = {}): Promise<PromptListResponse>{
    const {data} = await api.get<PromptListResponse>("/prompts",{params})
    
    return data
}

export async function getPrompt(id: string): Promise<PromptResponse>{
    const {data} = await api.get<PromptResponse>(`/prompts/${encodeURIComponent(id)}`)
    
    return data
}

export async function getPromptTags(): Promise<TagsResponse>{
    const {data} = await api.get<TagsResponse>("/prompts/tags")
    
    return data
}

export async function createPrompt(input: CreatePromptInput): Promise<PromptResponse>{
    const {data} = await api.post<PromptResponse>("/prompts",input)
    
    return data
}

export async function updatePrompt(id:string, input:UpdatePromptInput): Promise<PromptResponse>{
    const {data} = await api.put<PromptResponse>(`/prompts/${encodeURIComponent(id)}`,input)

    return data
}

export async function togglePin(id:string): Promise<PromptResponse>{
    const {data} = await api.patch<PromptResponse>(`/prompts/${encodeURIComponent(id)}/pin`)

    return data
}

export async function recordPromptUse(id:string): Promise<PromptResponse>{
    const {data} = await api.post<PromptResponse>(`/prompts/${encodeURIComponent(id)}/use`)

    return data
}

export async function deletePrompt(id:string) : Promise<void>{
    await api.delete(`/prompts/${encodeURIComponent(id)}`)
}