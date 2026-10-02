import { pservice } from "@/services/products.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allProduct = await pservice.allProduct();

    return NextResponse.json(
      {
        data: allProduct,
        message: "Successfully get products",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in get products",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const product = await pservice.createProduct(body);

    return NextResponse.json(
      {
        data: product,
        message: "Successfully created product",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in post product",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}