"use client";

import { getChatHistory } from "@/server/actions/chatHistory";
import { useEffect, useState } from "react";

// Define a type for the conversation data with serialized dates
// This ensures type safety for the data fetched from the server action
type ConversationWithSerializedDates = {
	id: string;
	title: string;
	updatedAt: string; // Was Date, now string
	messages: { content: string | null }[];
};

export function HistoryView() {
	const [conversations, setConversations] = useState<ConversationWithSerializedDates[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const historyData = await getChatHistory();
				setConversations(historyData as ConversationWithSerializedDates[]);
			} catch (err) {
				console.error("Failed to fetch chat history:", err);
				setError("Failed to load chat history.");
			} finally {
				setLoading(false);
			}
		};

		fetchHistory();
	}, []);

	if (loading) {
		return <p>Loading history...</p>;
	}

	if (error) {
		return <p className="text-red-500">{error}</p>;
	}

	if (conversations.length === 0) {
		return <p>No chat history found.</p>;
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Raw Conversation Data (for debugging)</h3>
			<pre className="p-4 bg-gray-800 rounded-md text-xs whitespace-pre-wrap">
				{JSON.stringify(conversations, null, 2)}
			</pre>
		</div>
	);
}
