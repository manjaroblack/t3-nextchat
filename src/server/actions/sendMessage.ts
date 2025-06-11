"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession } from "next-auth";

export async function sendMessage(message: string, llmId: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			throw new Error("Unauthorized: User is not authenticated.");
		}

		if (!process.env.OPENAI_API_KEY) {
			throw new Error("Missing OPENAI_API_KEY environment variable.");
		}

		// For now, we'll use a single model, but the `llmId` can be used later
		// to select different models or providers.
		const model = openai("gpt-4-turbo");

		const result = await streamText({
			model: model,
			prompt: message,
		});

		return result.toAIStream();
	} catch (error) {
		console.error("Error in sendMessage:", error);
		throw new Error("Failed to send message.");
	}
}
