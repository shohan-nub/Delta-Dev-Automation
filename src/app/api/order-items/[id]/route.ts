import { orderItemsService } from "@/services/order_items.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await orderItemsService.itemById(id);

    if (!item) {
      return NextResponse.json(
        { message: "Order item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: item,
        message: "Successfully get order item",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ORDER ITEM ERROR:", error);

    return NextResponse.json(
      { message: "Problem in get order item" },
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

    const item = await orderItemsService.updateItem(id, body);

    if (!item) {
      return NextResponse.json(
        { message: "Order item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: item,
        message: "Order item updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE ORDER ITEM ERROR:", error);

    return NextResponse.json(
      { message: "Problem in update order item" },
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

    const item = await orderItemsService.deleteItem(id);

    if (!item) {
      return NextResponse.json(
        { message: "Order item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: item,
        message: "Order item deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ORDER ITEM ERROR:", error);

    return NextResponse.json(
      { message: "Problem in delete order item" },
      { status: 500 }
    );
  }
}