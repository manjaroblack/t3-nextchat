"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import type { Message } from "ai";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function saveChat(messages: Message[], conversationId: string | null) {
	try {
		console.log(`Saving chat for conversationId: ${conversationId}`);
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}
		const userId = session.user.id;

		let convId = conversationId;
		let newConversation = false;

		if (!convId) {
			const conversation = await prisma.chatConversation.create({
				data: {
					userId: userId,
					title: messages.find((m) => m.role === "user")?.content.substring(0, 50) || "New Chat",
				},
			});
			convId = conversation.id;
			newConversation = true;
		}

		const messagesToSave = newConversation ? messages : messages.slice(-2);

		if (!convId) {
			throw new Error("Conversation ID is missing");
		}

		await prisma.chatMessage.createMany({
			data: messagesToSave.map((msg) => ({
				conversationId: convId,
				role: msg.role,
				content: msg.content,
			})),
		});

		revalidatePath("/chat");
		return { conversationId: convId };
	} catch (error) {
		console.error("Error in saveChat:", error);
		throw new Error("Failed to save chat.");
	}
}

export async function getChatHistory() {
	try {
		console.log("Fetching chat history for current user");
		const session = await getServerSession(authOptions);
		const userId = session?.user?.id;

		if (!userId) {
			return [];
		}

		const conversations = await prisma.chatConversation.findMany({
			where: { userId },
			orderBy: { updatedAt: "desc" },
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
					take: 1,
				},
			},
		});

		const processedConversations = conversations.map((convo) => ({
			...convo,
			createdAt: convo.createdAt.toISOString(),
			updatedAt: convo.updatedAt.toISOString(),
			messages: convo.messages.map((msg) => ({
				...msg,
				createdAt: msg.createdAt.toISOString(),
				updatedAt: msg.updatedAt.toISOString(),
			})),
		}));

		// Force serialization on the server to catch any errors with specific details.
		try {
			const serialized = JSON.stringify(processedConversations);
			return JSON.parse(serialized);
		} catch (e) {
			console.error("FATAL: Server-side data serialization error in getChatHistory:", e);
			// Log the problematic data structure if possible, but be careful with large objects.
			// console.error('Data that failed to serialize:', processedConversations);
			throw new Error("Failed to serialize chat history data on the server.");
		}
	} catch (error) {
		console.error("Error in getChatHistory:", error);
		return [];
	}
}

export async function getConversation(conversationId: string) {
	try {
		console.log(`Fetching conversation with id: ${conversationId}`);
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}
		const userId = session.user.id;

		const conversation = await prisma.chatConversation.findFirst({
			where: {
				id: conversationId,
				userId: userId,
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		return conversation;
	} catch (error) {
		console.error(`Error in getConversation for id: ${conversationId}:`, error);
		return null;
	}
}
