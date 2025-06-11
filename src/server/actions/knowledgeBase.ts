"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Document } from "@prisma/client";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
// import VirusTotal from 'virustotal.js';
import pdf from "pdf-parse";
import { createWorker } from "tesseract.js";

import { prisma as db } from "@/lib/prisma";
import { chunkText } from "@/lib/textChunking";

const UPLOAD_DIR = path.join(process.cwd(), ".uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = ["application/pdf", "text/plain", "image/png", "image/jpeg"];

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function uploadDocument(formData: FormData) {
	console.log("Starting document upload process...");
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;
	console.log(`User ID: ${userId} attempting to upload a document.`);
	if (!userId) {
		return { success: false, error: "Unauthorized" };
	}

	const file = formData.get("file") as File | null;
	if (!file) {
		return { success: false, error: "No file provided." };
	}

	if (file.size > MAX_FILE_SIZE) {
		return { success: false, error: "File size exceeds 10MB." };
	}

	if (!ALLOWED_FILE_TYPES.includes(file.type)) {
		return { success: false, error: "Invalid file type. Only PDF, TXT, and images are allowed." };
	}

	const filePath = path.join(UPLOAD_DIR, `${Date.now()}-${file.name}`);
	let documentRecord: Document | undefined;

	try {
		// 1. Create initial document record in DB
		documentRecord = await db.document.create({
			data: {
				name: file.name,
				userId: userId,
				status: "PROCESSING",
			},
		});

		// 2. Save file temporarily
		await fs.mkdir(UPLOAD_DIR, { recursive: true });
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		await fs.writeFile(filePath, buffer);

		// 3. Malware Scan
		// Temporarily disabled due to compilation issues with mmmagic on Windows
		// if (process.env.VIRUSTOTAL_API_KEY) {
		//     const virusTotal = new VirusTotal(process.env.VIRUSTOTAL_API_KEY);
		//     const analysis = await virusTotal.upload(filePath);
		//     const report = await virusTotal.report(analysis.id);
		//     if (report.results.positives > 0) {
		//         console.error(`Malware detected in file: ${file.name} for user ${userId}.`);
		//       throw new Error('Malware detected. Upload aborted.');
		//     }
		// } else {
		//     console.warn('VIRUSTOTAL_API_KEY not set. Skipping malware scan.');
		// }

		// console.log('Malware scan completed.'); // 4. Text Extraction
		let extractedText = "";
		console.log(`Extracting text from ${file.type}...`);
		if (file.type === "application/pdf") {
			const data = await fs.readFile(filePath);
			extractedText = (await pdf(data)).text;
		} else if (file.type === "text/plain") {
			extractedText = buffer.toString("utf-8");
		} else if (file.type.startsWith("image/")) {
			const worker = await createWorker("eng");
			const {
				data: { text },
			} = await worker.recognize(filePath);
			extractedText = text;
			await worker.terminate();
		}

		// 5. Text Chunking
		const chunks = chunkText(extractedText);
		console.log(`Text chunked into ${chunks.length} parts.`);
		if (chunks.length === 0) {
			throw new Error("Could not extract any text from the document.");
		}

		// 6. Generate Embeddings and store
		console.log(`Generating embeddings for ${chunks.length} chunks...`);
		for (const chunk of chunks) {
			const embeddingResponse = await openai.embeddings.create({
				model: "text-embedding-3-small",
				input: chunk,
			});
			const embedding = embeddingResponse.data[0].embedding;

			await db.$executeRaw`INSERT INTO "DocumentChunk" (id, content, "documentId", embedding) VALUES (gen_random_uuid(), ${chunk}, ${documentRecord.id}, ${embedding}::vector)`;
		}

		// 7. Update document status to SUCCESS
		console.log(`Document ${documentRecord.id} processed successfully.`);
		await db.document.update({
			where: { id: documentRecord.id },
			data: { status: "SUCCESS" },
		});

		return { success: true, message: `${file.name} processed and stored successfully.` };
	} catch (error) {
		console.error("Error during upload process:", error);
		// If an error occurred, update the document status to FAILED
		if (documentRecord) {
			await db.document.update({
				where: { id: documentRecord.id },
				data: { status: "FAILED" },
			});
		}
		return {
			success: false,
			error: error instanceof Error ? error.message : "An unknown error occurred.",
		};
	} finally {
		// 8. Clean up the temporary file
		if (await fs.stat(filePath).catch(() => false)) {
			await fs.unlink(filePath);
		}
	}
}

export async function getDocuments() {
	try {
		console.log("Fetching documents for current user...");
		const session = await getServerSession(authOptions);
		const userId = session?.user?.id;
		if (!userId) {
			// Return empty array or throw error if user is not authenticated
			return [];
		}

		const documents = await db.document.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});

		return documents;
	} catch (error) {
		console.error("Error in getDocuments:", error);
		return [];
	}
}

type SearchResult = {
	content: string;
	distance: number;
};

export async function semanticSearch(query: string) {
	console.log(`Performing semantic search for query: "${query}"`);
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;
	if (!userId) {
		return { success: false, error: "Unauthorized" };
	}

	if (!query) {
		return { success: false, error: "No query provided." };
	}

	try {
		// Generate embedding for the search query
		const embeddingResponse = await openai.embeddings.create({
			model: "text-embedding-3-small",
			input: query,
		});
		const queryEmbedding = embeddingResponse.data[0].embedding;

		// Find the most similar document chunks
		const searchResults = await db.$queryRaw<SearchResult[]>`
      SELECT
        dc.content,
        dc.embedding <=> ${queryEmbedding}::vector AS distance
      FROM "DocumentChunk" AS dc
      JOIN "Document" AS d ON dc."documentId" = d.id
      WHERE d."userId" = ${userId}
      ORDER BY distance
      LIMIT 5
    `;

		return { success: true, results: searchResults };
	} catch (error) {
		console.error("Error during semantic search:", error);
		return { success: false, error: "An error occurred during search." };
	}
}
