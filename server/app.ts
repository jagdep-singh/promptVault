import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import apiRouter from "./routes/index.js"

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", apiRouter)

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `No route matches ${req.method} ${req.originalUrl}`,
  })
})

export default app
