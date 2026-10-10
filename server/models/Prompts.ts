import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

export const TOOLS = [
    "code0",
    "chatgpt",
    "claude",
    "copilot",
    "other",
] as const

const promptSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title:{
            type: String,
            required: true,
            maxlength: 100,
            trim: true
        },
        content:{
            type: String,
            required: true,
            maxlength: 1000,
            trim: true
        },
        tags:{
            type: [String],
            default: []
        }, 
        tool:{
            type: String, 
            enum: TOOLS,
            default: "other"
        },
        isPinned:{
            type: Boolean,
            default: false
        },
        usedCount:{
            type: Number,
            default: 0
        },
    },{timestamps: true}
)

promptSchema.index({user: 1, isPinned: -1, updatedAt: -1})
promptSchema.index({user: 1, usedCount: -1})
promptSchema.index({user: 1, tags: 1})
promptSchema.index({title: 'text', content: 'text'})

promptSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform:(doc , ret: Record<string , any>) =>{
        ret.id = ret._id?.toString()
        delete ret._id
        delete ret.user
        return ret
    }
})

const Prompt = models.Prompt || model('Prompt', promptSchema)

export default Prompt