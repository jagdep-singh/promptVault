import ApiError from '../utils/ApiError.js'
import * as promptRepo from "../repositories/promptRepository.js"

interface PromptInput{
    title: string
    content: string
    tags?: string[]
    tool?: string  
}

interface ListOptions{
    search?: string
    tags?: string
    page?: number
    limit?: number
    sort?: "pinned" | "recent" | "used"
}

export async function createPromptsforUser(userId: string, input: PromptInput){
    return promptRepo.createPrompt(userId, input)
}

export async function listPromptsForUser(userId: string, options: ListOptions ={}){ 
    const page = options.page ?? 1
    const limit = options.limit ?? 10

    const sortBy = options.sort ?? "pinned"
    const [data, total] = await Promise.all([
        promptRepo.findPromptsByUser(userId, options),
        promptRepo.countPrompts(userId, options)
    ])

    const sortedData = data.sort((x,y) =>{
        if(sortBy === "used"){
            return y.usedCount - x.usedCount
        }

        if(sortBy === "recent"){
            return y.updatedAt.getTime() - x.updatedAt.getTime()
        }

        return Number(y.isPinned) - Number(x.isPinned) || 
               y.updatedAt.getTime() - x.updatedAt.getTime()
    })

    const start = (page - 1) * limit

    return{
        data: sortedData.slice(start, start + limit),
        page,
        total,
        limit,
        totalPages: Math.ceil(total / limit)
    }
}

export async function getPromptForUser(userId: string, promptId: string){
    const prompt = await promptRepo.findPromptById(userId, promptId)

    if(!prompt) throw new ApiError(404, "Prompt not found")

    return prompt
}

export async function updatePromptForUser(userId: string, promptId: string, input: Partial<PromptInput>){
    const prompt = await promptRepo.updatePrompt(userId, promptId, input)

    if(!prompt) throw new ApiError(404, "Prompt not found")

    return prompt
}

export async function deletePromptForUser(userId: string, promptId: string){
    const prompt = await promptRepo.deletePrompt(userId, promptId)

    if(!prompt) throw new ApiError(404, "Prompt not found")
}

export async function togglePinForUser(userId: string, promptId: string){
    const prompt = await promptRepo.togglePromptPin(userId, promptId)

    if(!prompt) throw new ApiError(404, "Prompt not found")

    return prompt
}

export async function recordPromptUse(userId: string, promptId: string){
    const prompt = await promptRepo.incrementPromptUse(userId, promptId)
    
    if(!prompt) throw new ApiError(404, "Prompt not found")

    return prompt
}

export async function listTagsForUser(userId: string){
    return promptRepo.getPromptTags(userId)
}
