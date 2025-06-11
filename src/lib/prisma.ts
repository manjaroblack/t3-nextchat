import { PrismaClient } from "@prisma/client";

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var globalForPrisma: PrismaClient | undefined;
}

export const prisma =
	global.globalForPrisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	global.globalForPrisma = prisma;
}
