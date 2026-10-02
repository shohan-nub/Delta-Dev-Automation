import { pservice } from "@/services/products.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await pservice.allProductId(id);

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: product,
        message: "Product get by id",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);

    return NextResponse.json(
      {
        message: "Product get id error",
      },
      { status: 500 }
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

    const product = await pservice.updateProduct(body, id);

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: product,
        message: "Successfully updated product",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: "Error in patch product",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await pservice.deleteProduct(id);

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: product,
        message: "Successfully deleted product",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: "Error in delete product",
      },
      { status: 500 }
    );
  }
}