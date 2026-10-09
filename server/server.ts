import "dotenv/config"
import app from "./app.js"
import { connectDB } from "./config/db.js"
import { validateEnv } from "./config/env.js"

const PORT = process.env.PORT || 5000

async function startServer() {
    try{
        validateEnv()
        await connectDB(process.env.MONGO_URI!)
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Error starting server:", error)
        process.exit(1)
    }
}

startServer()