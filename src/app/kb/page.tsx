import { DocumentList } from "@/components/kb/DocumentList";
import { FileUpload } from "@/components/kb/FileUpload";
import { Suspense } from "react";

export default function KnowledgeBasePage() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold tracking-tight mb-6">Knowledge Base Management</h1>
			<FileUpload />
			<Suspense fallback={<p>Loading documents...</p>}>
				<DocumentList />
			</Suspense>
		</div>
	);
}
