import { getChatHistory } from "@/server/actions/chatHistory";
import Link from "next/link";

export async function ChatHistory() {
	const history = await getChatHistory();

	return (
		<div className="flex flex-col flex-1 overflow-y-auto">
			<h2 className="text-lg font-semibold text-white p-4">History</h2>
			<nav className="flex-1 px-2 space-y-1">
				{history.map((chat) => (
					<Link
						key={chat.id}
						href={`/chat/${chat.id}`}
						className="block px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700"
					>
						{chat.title}
					</Link>
				))}
			</nav>
		</div>
	);
}
