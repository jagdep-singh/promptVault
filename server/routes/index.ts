import { Router } from "express"

import healthRoutes from "./healthRoutes.js"
import userRoutes from "./userRoutes.js"

const router = Router()

router.get("/", (_req, res) => {
  res.json({ message: "PromptVault API" })
})

router.use("/health", healthRoutes)
router.use("/users", userRoutes)

export default router
