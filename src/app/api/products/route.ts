import { pservice } from "@/services/products.service";
import { NextRequest, NextResponse } from "next/server";
import { parseProductPayload } from "@/lib/admin-crud";
import { apiErrorResponse } from "@/lib/api-errors";

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
    return apiErrorResponse(error, "GET PRODUCTS ERROR");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = parseProductPayload(await req.json());
    const result = await pservice.createProduct(body);

    return NextResponse.json(
      {
        data: result.data,
        message: "Successfully created product",
        ...(result.warning ? { warning: result.warning } : {}),
      },
      { status: 201 }
    );
  } catch (error) {
    return apiErrorResponse(error, "POST PRODUCT ERROR");
  }
}