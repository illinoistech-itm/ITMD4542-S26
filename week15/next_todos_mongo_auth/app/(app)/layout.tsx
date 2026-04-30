import NavLink from '@/components/NavLink';
import AddTodoForm from '@/components/AddTodoForm';
import { auth, signOut } from '@/auth';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar */}
      <header className="bg-blue-700 shadow">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-white">📝 Next.js Todos</h1>
            <div className="flex items-center gap-3">
              <nav className="flex gap-2">
                <NavLink href="/" exact>Active</NavLink>
                <NavLink href="/completed">Completed</NavLink>
              </nav>

              {/* User avatar + sign-out */}
              {session?.user && (
                <div className="flex items-center gap-2 pl-3 border-l border-white/30">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      className="w-7 h-7 rounded-full ring-2 ring-white/40"
                    />
                  )}
                  <span className="text-white/90 text-sm hidden sm:block">
                    {session.user.name}
                  </span>
                  <form
                    action={async () => {
                      'use server';
                      await signOut({ redirectTo: '/login' });
                    }}
                  >
                    <button
                      type="submit"
                      className="text-white/80 border border-white/30 hover:border-white/70 hover:bg-white/10 text-xs px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
          {/* Add todo form — available on every page */}
          <AddTodoForm />
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
