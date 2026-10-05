import { orderService } from "@/services/orders.service";
import { NextRequest, NextResponse } from "next/server";

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const paymentStatuses = ["pending", "paid", "failed", "refunded"] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await orderService.orderWithItems(id);

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: order,
        message: "Successfully get order",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in get order",
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid order update" },
        { status: 400 },
      );
    }

    if (
      body.orderStatus !== undefined &&
      !orderStatuses.includes(body.orderStatus)
    ) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 },
      );
    }

    if (
      body.paymentStatus !== undefined &&
      !paymentStatuses.includes(body.paymentStatus)
    ) {
      return NextResponse.json(
        { message: "Invalid payment status" },
        { status: 400 },
      );
    }

    const order = await orderService.updateOrder(id, body);

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: order,
        message: "Order updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in update order",
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

    const order = await orderService.deleteOrder(id);

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: order,
        message: "Order deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in delete order",
      },
      { status: 500 }
    );
  }
}