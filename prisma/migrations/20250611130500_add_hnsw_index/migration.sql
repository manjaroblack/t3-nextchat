-- Create a HNSW index on the 'embedding' column for faster similarity searches
CREATE INDEX ON "DocumentChunk" USING hnsw (embedding vector_l2_ops);
