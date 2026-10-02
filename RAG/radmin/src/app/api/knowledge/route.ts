import { kservice } from "@/services/knowledge.service";
import { NextRequest, NextResponse } from "next/server";

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
        console.error(error);

        return NextResponse.json(
            {
                message: "Problem in get knowledge",
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newKnowledge = await kservice.createKnowledge(body);

        return NextResponse.json(
            {
                data: newKnowledge,
                message: "Successfully created knowledge",
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Problem in post knowledge",
            },
            {
                status: 500,
            }
        );
    }
}