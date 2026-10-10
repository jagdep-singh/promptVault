
import { z } from "zod"

const promptTools = ["code0", "chatgpt", "claude", "copilot", "other"] as const

export const createPromptSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title required").max(120),
    content: z.string().trim().min(1, "Content required").max(10000),
    tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
    tool: z.enum(promptTools).optional(),
  }),
})

export const updatePromptSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(120).optional(),
    content: z.string().trim().min(1).max(10000).optional(),
    tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
    tool: z.enum(promptTools).optional(),
    isPinned: z.boolean().optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is needed",
  ),
})
