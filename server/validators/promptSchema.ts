
import { z } from "zod";

const promptFields = {
  title: z.string().trim().min(1, "Title is required").max(120),
  content: z.string().trim().min(1, "Content is required").max(10000),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  tool: z.enum(["code0", "chatgpt", "claude", "copilot", "other"]).optional(),
};

export const createPromptSchema = z.object(promptFields);

export const updatePromptSchema = z
  .object({
    title: promptFields.title.optional(),
    content: promptFields.content.optional(),
    tags: promptFields.tags,
    tool: promptFields.tool,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
