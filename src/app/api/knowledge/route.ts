import { kservice } from "@/services/knowledge.service";
import { NextRequest, NextResponse } from "next/server";
import { parseKnowledgePayload } from "@/lib/admin-crud";
import { apiErrorResponse } from "@/lib/api-errors";

export async function GET() {
    try {
        const allKnowledge = await kservice.allKnowledge();

        return NextResponse.json(
            {
                data: allKnowledge,
                message: "Successfully get all knowledge",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return apiErrorResponse(error, "GET KNOWLEDGE ERROR");
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = parseKnowledgePayload(await req.json());
        const result = await kservice.createKnowledge(body);

        return NextResponse.json(
            {
                data: result.data,
                message: "Successfully created knowledge",
                ...(result.warning ? { warning: result.warning } : {}),
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return apiErrorResponse(error, "POST KNOWLEDGE ERROR");
    }
}