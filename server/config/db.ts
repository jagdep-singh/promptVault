import mongoose from "mongoose"

export async function connectDB(uri: string) {
    if(!uri){
        throw new Error("MONGO_URI not defined")
    }
    await mongoose.connect(uri)
    console.log("MongoDB connected")
}