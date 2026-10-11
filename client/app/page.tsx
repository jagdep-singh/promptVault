import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">PromptVault</h1>
      <p>A simple prompt vault for managing and organizing your prompts</p>

      <Link
      href="/login">
        <Button>Login</Button>
      </Link>
      <Link
      href="/signup">
        <Button>Signup</Button>
      </Link>
      <Link
      href="/dashboard">
        <Button>dashboard</Button>
      </Link>
      
      
    </main>
  );
}
