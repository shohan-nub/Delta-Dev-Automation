import { db } from "@/db";
import { knowledgeChunks } from "@/db/schema/knowledge_chunks";
import { eq } from "drizzle-orm";

export class KnowledgeChunksRepo {

    async createMany(
        data: (typeof knowledgeChunks.$inferInsert)[]
    ) {
        return await db
            .insert(knowledgeChunks)
            .values(data)
            .returning();
    }

    async deleteByKnowledgeId(knowledgeId: string) {
        return await db
            .delete(knowledgeChunks)
            .where(eq(knowledgeChunks.knowledgeId, knowledgeId));
    }

    async getByKnowledgeId(knowledgeId: string) {
        return await db
            .select()
            .from(knowledgeChunks)
            .where(eq(knowledgeChunks.knowledgeId, knowledgeId));
    }
}

export const knowledgeChunksRepo = new KnowledgeChunksRepo();