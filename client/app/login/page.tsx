"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">

      <div className="relative w-full max-w-md">
        <div className="mb-10 flex items-center justify-center gap-3">
          <span className="text-xl font-semibold tracking-tight">
            PromptVault
          </span>
        </div>

        <section className="rounded-2xl border p-7 sm:p-9">
          <div className="mb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em]">
              Login
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign in to your vault
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border  px-4 text-sm outline-none "
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border px-4 text-sm outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-zinc-400">
            New to PromptVault?{" "}
            <Link href="/signup" className="font-black">
              Register
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
