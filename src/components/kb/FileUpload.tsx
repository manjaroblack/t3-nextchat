"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadDocument } from "@/server/actions/knowledgeBase";
import { type FormEvent, useState } from "react";

export function FileUpload() {
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [message, setMessage] = useState("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
			setMessage("");
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!file) {
			setMessage("Please select a file to upload.");
			return;
		}

		setIsUploading(true);
		setMessage("Uploading...");

		const formData = new FormData();
		formData.append("file", file);

		const result = await uploadDocument(formData);

		setIsUploading(false);
		if (result.success) {
			setMessage(result.message || "Upload successful!");
			setFile(null);
			// Reset file input
			const fileInput = document.getElementById("file-upload") as HTMLInputElement;
			if (fileInput) {
				fileInput.value = "";
			}
		} else {
			setMessage(`Error: ${result.error}`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="file-upload">Choose a file (PDF, TXT, PNG, JPG, max 10MB)</Label>
				<Input
					id="file-upload"
					type="file"
					onChange={handleFileChange}
					accept=".pdf,.txt,.png,.jpg,.jpeg"
				/>
			</div>
			<Button type="submit" disabled={!file || isUploading}>
				{isUploading ? "Uploading..." : "Upload File"}
			</Button>
			{message && <p className="text-sm text-gray-400 mt-2">{message}</p>}
		</form>
	);
}
