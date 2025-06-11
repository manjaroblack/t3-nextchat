"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type React from "react";
import { useState } from "react";

export function ChatInput() {
	const [input, setInput] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);
	};

	const sendMessage = () => {
		if (!input.trim()) return;
		// Placeholder for sending message logic
		console.log("Sending message:", input);
		setInput("");
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendMessage();
	};

	return (
		<form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
			<div className="relative">
				<Textarea
					value={input}
					onChange={handleInputChange}
					placeholder="Type your message here..."
					className="w-full resize-none bg-gray-700 border-gray-600 text-white rounded-md p-2 pr-20"
					rows={1}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
				/>
				<Button type="submit" disabled={!input.trim()} className="absolute bottom-2 right-2">
					Send
				</Button>
			</div>
		</form>
	);
}
