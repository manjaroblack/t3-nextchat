"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

// Placeholder for actual LLM data
const llms = [
	{ id: "gpt-4", name: "GPT-4" },
	{ id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
	{ id: "llama-3", name: "Llama 3" },
];

export function LLMSelector() {
	const [selectedModel, setSelectedModel] = useState(llms[0].id);

	return (
		<div className="w-full max-w-xs">
			<Select value={selectedModel} onValueChange={setSelectedModel}>
				<SelectTrigger className="bg-gray-700 border-gray-600 text-white">
					<SelectValue placeholder="Select a model" />
				</SelectTrigger>
				<SelectContent className="bg-gray-800 text-white border-gray-600">
					{llms.map((llm) => (
						<SelectItem key={llm.id} value={llm.id}>
							{llm.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
