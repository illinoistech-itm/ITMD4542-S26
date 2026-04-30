import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, account, profile }) {
      // account and profile are only present on the initial sign-in
      if (account && profile) {
        console.log('GitHub account:', account);
        console.log('GitHub profile:', profile);
        // Explicitly store the GitHub numeric user ID — Auth.js would otherwise
        // set token.sub to an internal UUID in JWT-only (no adapter) mode
        token.sub = String((profile as { id: number }).id);
      }
      return token;
    },
    session({ session, token }) {
      // token.sub is the GitHub user ID — expose it as session.user.id
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});

// Re-export GET and POST so the route handler can do:
//   export { GET, POST } from '@/auth'
export const { GET, POST } = handlers;
