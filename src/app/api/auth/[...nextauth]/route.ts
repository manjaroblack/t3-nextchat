import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
	console.warn(
		"GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables are not set. Google OAuth will not function.",
	);
}

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		...(googleClientId && googleClientSecret
			? [
					GoogleProvider({
						clientId: googleClientId,
						clientSecret: googleClientSecret,
					}),
				]
			: []),
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
