import { krepo } from "@/repositories/knowledge.repository";
import { knowledgeChunksRepo } from "@/repositories/know_chunk.repository";
import { lchunk } from "@/lib/chunking";
import { knowledge } from "@/db/schema/knowledge";

export class KnowledgeService {

    async allKnowledge() {
        return await krepo.getall();
    }

    async allKnowledgeId(id: string) {
        return await krepo.getbyId(id);
    }

    // Send chunks to n8n for embedding
    private async sendChunksToN8n(
        chunks: {
            id: string;
            knowledgeId: string;
            chunkIndex: number;
            content: string;
        }[]
    ) {
        const url =
            process.env.N8N_KNOWLEDGE_EMBEDDING_WEBHOOK;

        if (!url) {
            throw new Error(
                "N8N_KNOWLEDGE_EMBEDDING_WEBHOOK is missing"
            );
        }

        const response = await fetch(url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                chunks,
            }),
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(
                `n8n webhook failed: ${response.status} ${result}`
            );
        }

        return result;
    }

    // CREATE
    async createKnowledge(
        data: typeof knowledge.$inferInsert
    ) {

        // 1. Save original knowledge
        const newKnowledge = await krepo.create(data);

        // 2. Create chunks
        const chunks = await lchunk(
            newKnowledge.content
        );

        // 3. Convert chunks into DB format
        const chunkData = chunks.map(
            (content, index) => ({
                knowledgeId: newKnowledge.id,
                chunkIndex: index,
                content,
            })
        );

        // 4. Save chunks
        const savedChunks =
            await knowledgeChunksRepo.createMany(
                chunkData
            );

        // 5. Send saved chunks to n8n
        await this.sendChunksToN8n(savedChunks);

        return newKnowledge;
    }

    // DELETE
    async deleteKnowledge(id: string) {
        return await krepo.delete(id);
    }

    // UPDATE
    async updateKnowledge(
        id: string,
        data: Partial<typeof knowledge.$inferInsert>
    ) {

        // 1. Update original knowledge
        const updatedKnowledge =
            await krepo.update(id, data);

        // 2. Only recreate chunks if content changed
        if (data.content !== undefined) {

            // Delete old chunks
            await knowledgeChunksRepo
                .deleteByKnowledgeId(id);

            // Create new chunks
            const chunks = await lchunk(
                updatedKnowledge.content
            );

            // Convert into DB format
            const chunkData = chunks.map(
                (content, index) => ({
                    knowledgeId: id,
                    chunkIndex: index,
                    content,
                })
            );

            // Save new chunks
            const savedChunks =
                await knowledgeChunksRepo.createMany(
                    chunkData
                );

            // Send new chunks to n8n
            await this.sendChunksToN8n(
                savedChunks
            );
        }

        return updatedKnowledge;
    }
}

export const kservice = new KnowledgeService();