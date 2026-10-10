import { Router } from "express"

import healthRoutes from "./healthRoutes.js"
import userRoutes from "./authRoutes.js"
import promptRoutes from "./promptRoutes.js"

const router = Router()

router.get("/", (_req, res) => {
  res.json({ message: "PromptVault API" })
})

router.use("/health", healthRoutes)
router.use("/auth", userRoutes)
router.use("/prompts", promptRoutes)

export default router
