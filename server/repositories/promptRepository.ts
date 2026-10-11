import mongoose from 'mongoose'
import Prompt  from '../models/Prompts.js'

export async function createPrompt(
    userId : string,
    data:{
        title: string
        content: string
        tags?: string[]
        tool?: string
    }
){
    return Prompt.create({
        ...data , user: userId
    })
}

export const findPromptsByUser = async (
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
    search,
    tags,
    page = 1,
    limit = 10,
    sort = "pinned",
  } = filter;

  const query: Record<string, any> = { user: userId };

  if (tags) {
    query.tags = tags;
  }

  if (search?.trim()) {
    query.$text = { $search: search.trim() };
  }

  const sortOptions: Record<string, 1 | -1> =
    sort === "recent"
      ? { updatedAt: -1 }
      : sort === "used"
        ? { usedCount: -1, updatedAt: -1 }
        : { isPinned: -1, updatedAt: -1 };

  const skip = (page - 1) * limit;

  return Prompt.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .exec();
};

export async function findPromptById(userId: string, promptId: string){

    return Prompt.findOne({
        _id: promptId,
        user: userId
    })

}

export async function updatePrompt(userId:string , promptId:string , data:Record<string , unknown>){
    return Prompt.findOneAndUpdate(
        {
            _id: promptId,
            user: userId
        },
        {$set: data},
        {new: true , runValidators: true}
    )
}

export async function deletePrompt(userId:string , promptId:string){
    return Prompt.findOneAndDelete({
        _id: promptId,
        user: userId
    })
}

export async function togglePromptPin(userId:string , promptId:string){
    const prompt = await findPromptById(userId , promptId)
    if(!prompt) return null

    prompt.isPinned = !prompt.isPinned
    return await prompt.save()
}

export async function incrementPromptUse(userId:string , promptId:string){
    return Prompt.findOneAndUpdate(
        {_id: promptId , user: userId},
        {$inc: {usedCount: 1}},
        {new: true}
    )
}

export const countPrompts = async (
  userId: string,
  filter: {
    search?: string;
    tags?: string;
  } = {}
) => {
  const { search, tags } = filter;

  const query: Record<string, any> = { user: userId };

  if (tags) {
    query.tags = tags;
  }

  if (search?.trim()) {
    query.$text = { $search: search.trim() };
  }

  return Prompt.countDocuments(query).exec();
};

export const getPromptTags = async (userId: string) => {
  const tags = await Prompt.distinct("tags", {
    user: userId,
  });

  return tags.sort((a, b) => a.localeCompare(b));
};