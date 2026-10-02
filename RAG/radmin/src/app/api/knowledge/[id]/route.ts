import { kservice } from "@/services/knowledge.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const knowledge = await kservice.allKnowledgeId(id);

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
        console.error(error);

        return NextResponse.json(
            {
                message: "Problem in get knowledge by id",
            },
            {
                status: 500,
            }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updatedKnowledge = await kservice.updateKnowledge(
            id,
            body
        );

        return NextResponse.json(
            {
                data: updatedKnowledge,
                message: "Successfully updated knowledge",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Problem in update knowledge",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const deletedKnowledge = await kservice.deleteKnowledge(id);

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
        console.error(error);

        return NextResponse.json(
            {
                message: "Problem in delete knowledge",
            },
            {
                status: 500,
            }
        );
    }
}