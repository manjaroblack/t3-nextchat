import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react";
import React from "react";

interface ChatMessageProps {
	role: "user" | "ai";
	content: string;
	kbUsed?: boolean;
}

export function ChatMessage({ role, content, kbUsed }: ChatMessageProps) {
	const isUser = role === "user";

	return (
		<div
			className={cn(
				"flex items-start gap-4 p-4 rounded-lg",
				isUser ? "justify-end" : "justify-start",
			)}
		>
			{!isUser && (
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold shrink-0">
						AI
					</div>
					{kbUsed && (
						<BrainCircuit className="w-5 h-5 text-blue-400" title="Answer from Knowledge Base" />
					)}
				</div>
			)}
			<div
				className={cn(
					"max-w-md p-3 rounded-lg",
					isUser ? "bg-blue-600 text-white" : "bg-gray-600 text-white",
				)}
			>
				<p>{content}</p>
			</div>
			{isUser && (
				<div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center font-bold shrink-0">
					U
				</div>
			)}
		</div>
	);
}
