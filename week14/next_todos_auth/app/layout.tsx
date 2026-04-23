import type { Metadata } from "next";
import "./globals.css";
import NavLink from "@/components/NavLink";
import AddTodoForm from "@/components/AddTodoForm";
import { UserBar } from "@/components/UserBar";
import { SignIn } from "@/components/auth/signin-button-github";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Next.js Todos",
  description: "A simple todo app built with Next.js App Router",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    return (
      <html lang="en" className="h-full">
        <body className="min-h-full bg-gray-50 font-sans antialiased">
          <div>Not Authenticated</div>
          <SignIn />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50 font-sans antialiased">
        {/* Navigation bar */}
        <header className="bg-blue-700 shadow">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <UserBar />
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-white">📝 Next.js Todos</h1>
              <nav className="flex gap-2">
                <NavLink href="/" exact>
                  Active
                </NavLink>
                <NavLink href="/completed">Completed</NavLink>
              </nav>
            </div>
            {/* Add todo form — available on every page */}
            <AddTodoForm />
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
