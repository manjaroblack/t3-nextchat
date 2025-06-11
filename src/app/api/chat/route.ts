import { OpenAIStream, StreamingTextResponse, experimental_StreamData } from "ai";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

import { semanticSearch } from "@/server/actions/knowledgeBase";
import { authOptions } from "./[...nextauth]/route";

export const runtime = "edge";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	if (!process.env.OPENAI_API_KEY) {
		return new Response("Missing OPENAI_API_KEY", { status: 500 });
	}

	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const { messages } = await req.json();
	const data = new experimental_StreamData();

	// Check for knowledge base context
	const lastMessage = messages[messages.length - 1]?.content;

	if (typeof lastMessage === "string") {
		const searchResponse = await semanticSearch(lastMessage);
		if (
			searchResponse.success &&
			Array.isArray(searchResponse.results) &&
			searchResponse.results.length > 0
		) {
			const context = searchResponse.results
				.map((r: { content: string }) => r.content)
				.join("\n---\n");
			const contextMessage = `You are a helpful AI assistant. Use the following context from the user's knowledge base to answer their question.\nCONTEXT:\n${context}`;

			// Add the context as a system message
			messages.unshift({ role: "system", content: contextMessage });
			data.append({ kbUsed: true });
		}
	}

	// Ask OpenAI for a streaming chat completion given the prompt
	const response = await openai.chat.completions.create({
		model: "gpt-4-turbo",
		stream: true,
		messages,
	});

	const stream = OpenAIStream(response, {
		experimental_streamData: true,
		onFinal() {
			data.close();
		},
	});

	return new StreamingTextResponse(stream, {}, data);
}
