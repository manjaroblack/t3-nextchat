export function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
	const chunks: string[] = [];
	let i = 0;

	if (!text) {
		return [];
	}

	while (i < text.length) {
		const end = i + chunkSize;
		chunks.push(text.slice(i, end));
		i += chunkSize - overlap;
	}

	return chunks;
}
