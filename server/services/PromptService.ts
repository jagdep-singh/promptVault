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


export const listPromptsForUser = async (
  userId: string,
  filter: {
    search?: string;
    tags?: string;
    page?: number;
    limit?: number;
    sort?: "pinned" | "recent" | "used";
  } = {}
) => {
  const {
    page = 1,
    limit = 10,
    ...queryFilters
  } = filter;

  const [prompts, total] = await Promise.all([
    promptRepo.findPromptsByUser(userId, {
      ...queryFilters,
      page,
      limit,
    }),
    promptRepo.countPrompts(userId, queryFilters),
  ]);

  return {
    prompts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


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
