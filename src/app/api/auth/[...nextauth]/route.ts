console.log("<<<<< EXECUTING LATEST NEXTAUTH ROUTE.TS - VERSION 2 >>>>>");
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "../../../../generated/prisma"; // Adjusted path

const prisma = new PrismaClient();

const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

if (!githubId || !githubSecret) {
	console.warn(
		"GITHUB_ID or GITHUB_SECRET environment variables are not set. GitHub OAuth will not function.",
	);
}

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		...(githubId && githubSecret
			? [
					GitHubProvider({
						clientId: githubId,
						clientSecret: githubSecret,
					}),
				]
			: []),
		// You can add more providers here (e.g., Google, Credentials)
	],
	// Optional: Add custom pages, callbacks, session strategy, etc.
	// pages: {
	//   signIn: '/auth/signin',
	// },
	// session: {
	//   strategy: 'jwt',
	// },
	// callbacks: {
	//   async jwt({ token, user }) {
	//     if (user) {
	//       token.id = user.id;
	//     }
	//     return token;
	//   },
	//   async session({ session, token }) {
	//     if (session.user) {
	//       session.user.id = token.id as string;
	//     }
	//     return session;
	//   },
	// },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
