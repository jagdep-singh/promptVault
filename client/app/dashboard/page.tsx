"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import {
  deletePrompt,
  getPromptTags,
  listPrompts,
  recordPromptUse,
  togglePin,
} from "@/lib/api/prompts";
import type {
  ListPromptsParams,
  Prompt,
  PromptPagination,
} from "@/lib/api/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Search,
  Plus,
  Copy,
  Pin,
  Pencil,
  Trash2,
  LogOut,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
} from "lucide-react";

const INITIAL_PAGINATION: PromptPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [pagination, setPagination] =
    useState<PromptPagination>(INITIAL_PAGINATION);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sort, setSort] =
    useState<NonNullable<ListPromptsParams["sort"]>>("recent");
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, user, router]);

  const loadPrompts = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await listPrompts({
        search: search || undefined,
        tag: selectedTag || undefined,
        sort,
        page,
      });

      setPrompts(response.prompts);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load prompts.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, search, selectedTag, sort, page]);

  useEffect(() => {
    if (user) void loadPrompts();
  }, [user, loadPrompts]);

  useEffect(() => {
    if (!user) return;

    getPromptTags()
      .then((response) => setTags(response.tags))
      .catch(() => setTags([]));
  }, [user]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleCopy(prompt: Prompt) {
    setBusyId(prompt.id);
    setActionError("");
    setNotice("");

    try {
      await navigator.clipboard.writeText(prompt.content);
      await recordPromptUse(prompt.id);
      setNotice(`"${prompt.title}" copied to clipboard.`);
      await loadPrompts();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to copy or track this prompt.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handlePin(prompt: Prompt) {
    setBusyId(prompt.id);
    setActionError("");
    setNotice("");

    try {
      const response = await togglePin(prompt.id);

      setPrompts((current) =>
        current.map((item) =>
          item.id === prompt.id ? response.data : item,
        ),
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to update the pin.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(prompt: Prompt) {
    if (
      !window.confirm(
        `Delete "${prompt.title}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setBusyId(prompt.id);
    setActionError("");
    setNotice("");

    try {
      await deletePrompt(prompt.id);

      if (prompts.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadPrompts();
      }

      setNotice("Prompt deleted.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to delete this prompt.",
      );
    } finally {
      setBusyId(null);
    }
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (isAuthLoading || !user) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl space-y-6 px-5 py-10 sm:px-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              PromptVault<span className="text-primary">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Log out
            </Button>
          </div>
        </header>

        <Separator className="my-6" />

        <section className="flex flex-wrap items-end justify-between gap-5 py-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              Workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your prompts
            </h1>
          </div>

          <Button onClick={() => router.push("/dashboard/new")}>
            <Plus className="mr-2 size-4" />
            New prompt
          </Button>
        </section>

        <Card className="my-6">
          <CardContent className="p-4 sm:p-5">
            <form
              onSubmit={handleSearch}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_170px_auto]"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search prompts..."
                  aria-label="Search prompts"
                  className="pl-9"
                />
              </div>

              <select
                value={selectedTag}
                onChange={(event) => {
                  setSelectedTag(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by tag"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(event) => {
                  setSort(
                    event.target.value as NonNullable<
                      ListPromptsParams["sort"]
                    >,
                  );
                  setPage(1);
                }}
                aria-label="Sort prompts"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="recent">Most recent</option>
                <option value="pinned">Pinned first</option>
                <option value="used">Most used</option>
              </select>

              <Button type="submit">
                <Search className="mr-2 size-4" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {actionError && (
          <Alert variant="destructive" className="mb-5">
            <AlertCircle className="size-4" />
            <AlertTitle>Action failed</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {notice && (
          <Alert className="mb-5">
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {pagination.total}{" "}
            {pagination.total === 1 ? "prompt" : "prompts"}
          </p>

          {pagination.totalPages > 0 && (
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="size-4" />
            <AlertTitle>Could not load prompts</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadPrompts()}
              >
                <RefreshCw className="mr-2 size-4" />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoading && !error && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && prompts.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                <FileText className="size-7 text-muted-foreground" />
              </span>
              <h2 className="text-lg font-semibold">No prompts found</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {search || selectedTag
                  ? "nothing for this filter"
                  : ""}
              </p>
              {search || selectedTag ? (
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setSelectedTag("");
                    setPage(1);
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button
                  className="mt-5"
                  onClick={() => router.push("/dashboard/new")}
                >
                  <Plus className="mr-2 size-4" />
                  Create your first prompt
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && prompts.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="flex min-w-0 flex-col transition-colors hover:border-primary/40"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="wrap-break-word text-base">
                        {prompt.title}
                      </CardTitle>
                      <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{prompt.tool}</Badge>
                        <span>Used {prompt.usedCount} times</span>
                      </CardDescription>
                    </div>

                    <Button
                      variant={prompt.isPinned ? "secondary" : "ghost"}
                      size="icon"
                      disabled={busyId === prompt.id}
                      onClick={() => void handlePin(prompt)}
                      aria-label={
                        prompt.isPinned ? "Unpin prompt" : "Pin prompt"
                      }
                      title={prompt.isPinned ? "Unpin prompt" : "Pin prompt"}
                    >
                      <Pin
                        className={`size-4 ${prompt.isPinned ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                  <p className="line-clamp-5 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                    {prompt.content}
                  </p>

                  {prompt.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {prompt.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSelectedTag(tag);
                            setPage(1);
                          }}
                          title={`Filter by ${tag}`}
                        >
                          <Badge
                            variant={selectedTag === tag ? "default" : "outline"}
                            className="cursor-pointer"
                          >
                            {tag}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>

                <Separator />

                <CardFooter className="flex flex-wrap gap-2 pt-4">
                  <Button
                    size="sm"
                    onClick={() => void handleCopy(prompt)}
                    disabled={busyId === prompt.id}
                  >
                    <Copy className="mr-2 size-4" />
                    {busyId === prompt.id ? "Working..." : "Copy & use"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/dashboard/${encodeURIComponent(prompt.id)}/edit`,
                      )
                    }
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={busyId === prompt.id}
                    onClick={() => void handleDelete(prompt)}
                    aria-label="Delete prompt"
                    title="Delete prompt"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && pagination.totalPages > 1 && (
          <nav
            aria-label="Prompt pagination"
            className="mt-8 flex items-center justify-center gap-4"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              {pagination.page} / {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages || isLoading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </nav>
        )}
      </div>
    </main>
  );
}
