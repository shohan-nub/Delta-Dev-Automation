import { orderItemsService } from "@/services/order_items.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await orderItemsService.allItems();

    return NextResponse.json(
      {
        data: items,
        message: "Successfully get order items",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ORDER ITEMS ERROR:", error);

    return NextResponse.json(
      { message: "Problem in get order items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const item = await orderItemsService.createItem(body);

    return NextResponse.json(
      {
        data: item,
        message: "Order item created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ORDER ITEM ERROR:", error);

    return NextResponse.json(
      { message: "Problem in create order item" },
      { status: 500 }
    );
  }
}