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

export async function findPromptsByUser(
    userId: string,
    filter:{
        search?: string
        tags?:string
    } = {}
){
    const query: Record<string, unknown> = {user: userId}

    if(filter.tags){
        query.tags = filter.tags
    }
    if(filter.search){
        query.$text = { $search: filter.search }
    }
    return Prompt.find(query).sort({isPinned: -1, updatedAt: -1})
}

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

export async function countPrompts(
    userId:string,
    filter:{
        search?: string
        tags?:string
    } = {}
){
    const query: Record<string, unknown> = {user: userId}

    if(filter.tags) query.tags = filter.tags
    if (filter.search) query.$text = {$search: filter.search}

    return Prompt.countDocuments(query)
}

export async function getPromptTags(userId:string){
    const tags = await Prompt.aggregate([
        {$match: {user: new mongoose.Types.ObjectId(userId)}},
        {$unwind: "$tags"},
        {$group: {_id: "$tags", count: {$sum: 1}}},
        {$sort: {count: -1, _id: 1}},
        {$project: {_id: 0, name: "$_id", count: 1}}
    ])
}
