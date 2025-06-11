import { ChatHistory } from "@/components/chat/ChatHistory";
import React from "react";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen bg-gray-900 text-white overflow-hidden">
			{/* Sidebar */}
			<aside className="w-64 bg-gray-800 text-white flex flex-col">
				<div className="p-4 border-b border-gray-700">
					<h1 className="text-2xl font-bold">T3-NextChat</h1>
				</div>
				<React.Suspense fallback={<div className="p-4">Loading history...</div>}>
					<ChatHistory />
				</React.Suspense>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 flex flex-col">{children}</main>
		</div>
	);
}
