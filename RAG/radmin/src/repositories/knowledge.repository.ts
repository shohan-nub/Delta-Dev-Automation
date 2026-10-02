import { db } from "@/db";
import { knowledge} from "@/db/schema/knowledge";
import { eq } from "drizzle-orm";

export class KnowledgeRepo{
    async getall(){
        return await db.select().from(knowledge);
    }

    async getbyId(id:string){
        const [knowledges]=await db.select().
        from(knowledge).
        where(eq(knowledge.id,id));

        return knowledges;
    };

    async create(data:typeof knowledge.$inferInsert){
        const [knowledges]=await db.
        insert(knowledge).values(data).returning();

        return knowledges;
    };

    async delete(id:string){
        const [knowledges]=await db.delete(knowledge).
        where(eq(knowledge.id,id)).returning();

        return knowledges;
    };

    async update(id:string,data:Partial<typeof knowledge.$inferInsert>){
       const [knowledges]=await db.update(knowledge).
       set({...data,updated_at:new Date()}).where(eq(knowledge.id,id)).returning();

       return knowledges;

    }
};
 export const krepo=new KnowledgeRepo()