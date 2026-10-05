import { kservice } from "@/services/knowledge.service";
import { NextRequest, NextResponse } from "next/server";
import { parseKnowledgePayload } from "@/lib/admin-crud";
import { apiErrorResponse } from "@/lib/api-errors";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const knowledge = await kservice.allKnowledgeId(id);

        if (!knowledge) {
            return NextResponse.json(
                { message: "Knowledge entry not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                data: knowledge,
                message: "Successfully get knowledge",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return apiErrorResponse(error, "GET KNOWLEDGE BY ID ERROR");
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = parseKnowledgePayload(await req.json(), true);

        const result = await kservice.updateKnowledge(
            id,
            body
        );

        if (!result || !result.data) {
            return NextResponse.json(
                { message: "Knowledge entry not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                data: result.data,
                message: "Successfully updated knowledge",
                ...(result.warning ? { warning: result.warning } : {}),
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return apiErrorResponse(error, "PATCH KNOWLEDGE ERROR");
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const deletedKnowledge = await kservice.deleteKnowledge(id);

        if (!deletedKnowledge) {
            return NextResponse.json(
                { message: "Knowledge entry not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                data: deletedKnowledge,
                message: "Successfully deleted knowledge",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return apiErrorResponse(error, "DELETE KNOWLEDGE ERROR");
    }
}