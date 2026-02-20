import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <nav className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
            Dashboard
          </h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        <p className="text-zinc-500 dark:text-zinc-400">Dashboard content</p>
      </main>
    </div>
  );
}
