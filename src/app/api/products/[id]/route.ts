import { pservice } from "@/services/products.service";
import { NextRequest, NextResponse } from "next/server";
import { parseProductPayload } from "@/lib/admin-crud";
import { apiErrorResponse } from "@/lib/api-errors";

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
    return apiErrorResponse(error, "GET PRODUCT BY ID ERROR");
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = parseProductPayload(await req.json(), true);
    const result = await pservice.updateProduct(body, id);

    if (!result || !result.data) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: result.data,
        message: "Successfully updated product",
        ...(result.warning ? { warning: result.warning } : {}),
      },
      { status: 200 }
    );
  } catch (error) {
    return apiErrorResponse(error, "PATCH PRODUCT ERROR");
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
    return apiErrorResponse(error, "DELETE PRODUCT ERROR");
  }
}