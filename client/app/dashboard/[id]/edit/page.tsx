"use client";

import { Suspense, useCallback, useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { getPrompt, updatePrompt } from "@/lib/api/prompts";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const TOOLS: { value: PromptTool; label: string }[] = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "copilot", label: "GitHub Copilot" },
  { value: "code0", label: "Code0" },
  { value: "opencode", label: "OpenCode" },
  { value: "other", label: "Other" },
];

function EditPromptPageContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { user, isLoading: isAuthLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tool, setTool] = useState<PromptTool>("chatgpt");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, user, router]);

  const loadPrompt = useCallback(async () => {
    if (!user || !id) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await getPrompt(id);
      const prompt = response.data;

      setTitle(prompt.title);
      setContent(prompt.content);
      setTool(prompt.tool);
      setTags(prompt.tags ?? []);
      setLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load this prompt.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    if (!user) return;

    const timeoutId = window.setTimeout(() => {
      void loadPrompt();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [user, loadPrompt]);

  function addTag() {
    const nextTag = tagInput.trim().replace(/^#/, "");
    if (!nextTag) return;

    if (!tags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) {
      setTags((current) => [...current, nextTag]);
    }

    setTagInput("");
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
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
      await updatePrompt(id, {
        title: title.trim(),
        content: content.trim(),
        tags,
        tool,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update this prompt.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isAuthLoading || !user || isLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl space-y-6 px-5 py-10">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </main>
    );
  }

  if (!loaded) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-10">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <Alert variant="destructive">
          <AlertTitle>Unable to open prompt</AlertTitle>
          <AlertDescription>{error || "Prompt not found."}</AlertDescription>
        </Alert>

        <div className="mt-4 flex gap-3">
          <Button variant="outline" onClick={() => void loadPrompt()}>
            Try again
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Return to dashboard
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <div className="mb-7">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Prompt library
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Edit prompt
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update your prompt details and save your changes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prompt details</CardTitle>
            <CardDescription>
              Changes will be saved to your prompt library.
            </CardDescription>
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
                  placeholder="Prompt title"
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
                  placeholder="Write your prompt here..."
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
                    placeholder="Add a tag"
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
                  <AlertTitle>Unable to save changes</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving || !title.trim() || !content.trim()}
                >
                  {isSaving ? "Saving changes..." : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function EditPromptPageFallback() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-6 px-5 py-10">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </main>
  );
}

export default function EditPromptPage() {
  return (
    <Suspense fallback={<EditPromptPageFallback />}>
      <EditPromptPageContent />
    </Suspense>
  );
}
