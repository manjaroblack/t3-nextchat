import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getDocuments } from "@/server/actions/knowledgeBase";

function StatusBadge({ status }: { status: string }) {
	const statusVariantMap: Record<string, BadgeProps["variant"]> = {
		SUCCESS: "default",
		PROCESSING: "secondary",
		PENDING: "outline",
		FAILED: "destructive",
	};
	const statusVariant = statusVariantMap[status];

	return <Badge variant={statusVariant}>{status}</Badge>;
}

export async function DocumentList() {
	const documents = await getDocuments();

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-semibold tracking-tight mb-4">My Knowledge Base</h2>
			<div className="rounded-md border">
				<Table>
					<TableCaption>A list of your uploaded documents.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[400px]">Document Name</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Uploaded At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{documents.map((doc) => (
							<TableRow key={doc.id}>
								<TableCell className="font-medium">{doc.name}</TableCell>
								<TableCell>
									<StatusBadge status={doc.status} />
								</TableCell>
								<TableCell className="text-right">{doc.createdAt.toLocaleDateString()}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
