"use client";

import { HistoryView } from "@/components/settings/HistoryView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

export default function SettingsPage() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (status === "unauthenticated" || !session?.user) {
		return (
			<div className="container mx-auto p-4">
				<p>You must be signed in to view this page.</p>
				<Link href="/" className="text-blue-500 hover:underline">
					Go to homepage to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-6 text-3xl font-bold tracking-tight">Settings</h1>
			<Tabs defaultValue="profile" className="w-full">
				<TabsList>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="history">History</TabsTrigger>
				</TabsList>
				<TabsContent value="profile" className="mt-4">
					<div className="space-y-2 rounded-lg border p-4">
						<h2 className="text-xl font-semibold">User Profile</h2>
						<p>
							<span className="font-semibold">Name:</span> {session.user.name}
						</p>
						<p>
							<span className="font-semibold">Email:</span> {session.user.email}
						</p>
					</div>
				</TabsContent>
				<TabsContent value="history" className="mt-4">
					<div className="rounded-lg border p-4">
						<h2 className="text-xl font-semibold mb-4">Chat History</h2>
						<Suspense fallback={<p>Loading history...</p>}>
							<HistoryView />
						</Suspense>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
