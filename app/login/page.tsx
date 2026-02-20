import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-sm space-y-8 rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950 dark:shadow-none sm:border sm:border-zinc-200 dark:sm:border-zinc-800">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Log in
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your account
          </p>
        </div>
        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Login form placeholder
        </div>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/register"
            className="font-medium text-zinc-950 hover:underline dark:text-zinc-50"
          >
            Create an account
          </Link>
          {" · "}
          <Link
            href="/dashboard"
            className="font-medium text-zinc-950 hover:underline dark:text-zinc-50"
          >
            Dashboard
          </Link>
        </p>
      </main>
    </div>
  );
}
