"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { createPrompt } from "@/lib/api/prompts";
import type { PromptTool } from "@/lib/api/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const TOOLS: { value: PromptTool; label: string }[] = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "copilot", label: "GitHub Copilot" },
  { value: "code0", label: "Code0" },
  { value: "opencode", label: "OpenCode" },
  { value: "other", label: "Other" },
];

export default function NewPromptPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tool, setTool] = useState<PromptTool>("chatgpt");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isLoading && !user && typeof window !== "undefined") {
    // The dashboard's auth guard handles the redirect.
  }

  function addTag() {
    const nextTag = tagInput.trim().replace(/^#/, "");
    if (!nextTag) return;

    if (!tags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) {
      setTags((current) => [...current, nextTag]);
    }

    setTagInput("");
  }

  function handleTagKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await createPrompt({
        title: title.trim(),
        content: content.trim(),
        tags,
        tool,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create the prompt.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <div className="mb-7">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create a prompt
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prompt details</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Explain a complex codebase"
                  maxLength={120}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Prompt content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Write or paste your prompt here..."
                  className="min-h-56 resize-y"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {content.length} characters
                </p>
              </div>

              <div className="space-y-2">
                <Label>AI tool</Label>
                <Select
                  value={tool}
                  onValueChange={(value) => setTool(value as PromptTool)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOOLS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="e.g. coding, debugging"
                    aria-describedby="tag-help"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                  >
                    <Plus className="mr-2 size-4" />
                    Add
                  </Button>
                </div>
                <p id="tag-help" className="text-xs text-muted-foreground">
                  Press Enter or use Add. Duplicate tags are ignored.
                </p>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 py-1 pl-3 pr-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setTags((current) =>
                              current.filter((item) => item !== tag),
                            )
                          }
                          className="ml-1 rounded-full p-1 hover:bg-background"
                          aria-label={`Remove ${tag} tag`}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving || !title.trim() || !content.trim()}
                >
                  {isSaving ? "Saving prompt..." : "Save prompt"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}