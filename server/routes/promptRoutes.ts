
import { Router } from "express"
import { Types } from "mongoose"

import auth from "../middleware/auth.js"
import validate from "../middleware/validate.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import * as promptService from "../services/PromptService.js"
import {
  createPromptSchema,
  updatePromptSchema,
} from "../validators/promptSchema.js"

const router = Router()

router.use(auth)

function getPromptId(id: string | string[]): string | null {
  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    return null
  }

  return id
}

router.get("/",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 10)
    const sortValue = String(req.query.sort ?? "pinned")

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        message: "Invalid pagination parameters",
      })
      return
    }

    if (!["pinned", "recent", "used"].includes(sortValue)) {
      res.status(400).json({
        message: "Invalid sort value",
      })
      return
    }

    const result = await promptService.listPromptsForUser(
      req.user!.id,
      {
        search: req.query.search
          ? String(req.query.search)
          : undefined,
        tags: req.query.tag
          ? String(req.query.tag)
          : undefined,
        page,
        limit,
        sort: sortValue as "pinned" | "recent" | "used",
      },
    )

    res.status(200).json(result)
  }),
)

router.get("/tags",
  asyncHandler(async (req, res) => {
    const tags = await promptService.listTagsForUser(req.user!.id)

    res.status(200).json({ tags })
  }),
)

router.post(
  "/",
  validate(createPromptSchema),
  asyncHandler(async (req, res) => {
    const prompt = await promptService.createPromptsforUser(
      req.user!.id,
      req.body,
    )

    res.status(201).json({ data: prompt })
  }),
)

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const promptId = getPromptId(req.params.id)

    if (!promptId) {
      res.status(400).json({ message: "Invalid prompt ID" })
      return
    }

    const prompt = await promptService.getPromptForUser(
      req.user!.id,
      promptId,
    )

    res.status(200).json({ data: prompt })
  }),
)

router.put(
  "/:id",
  validate(updatePromptSchema),
  asyncHandler(async (req, res) => {
    const promptId = getPromptId(req.params.id)

    if (!promptId) {
      res.status(400).json({ message: "Invalid prompt ID" })
      return
    }

    const prompt = await promptService.updatePromptForUser(
      req.user!.id,
      promptId,
      req.body,
    )

    res.status(200).json({ data: prompt })
  }),
)

router.patch(
  "/:id/pin",
  asyncHandler(async (req, res) => {
    const promptId = getPromptId(req.params.id)

    if (!promptId) {
      res.status(400).json({ message: "Invalid prompt ID" })
      return
    }

    const prompt = await promptService.togglePinForUser(
      req.user!.id,
      promptId,
    )

    res.status(200).json({ data: prompt })
  }),
)

router.post(
  "/:id/use",
  asyncHandler(async (req, res) => {
    const promptId = getPromptId(req.params.id)

    if (!promptId) {
      res.status(400).json({ message: "Invalid prompt ID" })
      return
    }

    const prompt = await promptService.recordPromptUse(
      req.user!.id,
      promptId,
    )

    res.status(200).json({ data: prompt })
  }),
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const promptId = getPromptId(req.params.id)

    if (!promptId) {
      res.status(400).json({ message: "Invalid prompt ID" })
      return
    }

    await promptService.deletePromptForUser(
      req.user!.id,
      promptId,
    )

    res.status(204).send()
  }),
)

export default router
