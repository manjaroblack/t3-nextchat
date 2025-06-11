"use client";

import { ChatMessage } from "@/components/chat/ChatMessage";
import { LLMSelector } from "@/components/chat/LLMSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveChat } from "@/server/actions/chatHistory";
import { useChat } from "ai/react";
import React, { useState } from "react";

export default function ChatPage() {
	const [conversationId, setConversationId] = useState<string | null>(null);

	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: "/api/chat",
		onFinish: async (message) => {
			const finalMessages = [...messages, message];
			const result = await saveChat(finalMessages, conversationId);
			if (result.conversationId && !conversationId) {
				setConversationId(result.conversationId);
			}
		},
	});

	return (
		<div className="h-full flex flex-col">
			<div className="p-4 border-b border-gray-700 flex justify-center">
				<LLMSelector />
			</div>
			<div className="flex-1 p-4 overflow-y-auto bg-gray-700 space-y-4">
				{messages.length > 0 ? (
					messages.map((m) => (
						<ChatMessage
							key={m.id}
							role={m.role as "user" | "ai"}
							content={m.content}
							kbUsed={m.data?.kbUsed as boolean | undefined}
						/>
					))
				) : (
					<div className="flex items-center justify-center h-full text-gray-400">
						<p>No messages yet. Start a conversation!</p>
					</div>
				)}
			</div>

			<form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
				<div className="relative">
					<Textarea
						value={input}
						onChange={handleInputChange}
						placeholder="Type your message here..."
						className="w-full resize-none bg-gray-700 border-gray-600 text-white rounded-md p-2 pr-20"
						rows={1}
					/>
					<Button type="submit" disabled={!input.trim()} className="absolute bottom-2 right-2">
						Send
					</Button>
				</div>
			</form>
		</div>
	);
}
