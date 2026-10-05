import { orderService } from "@/services/orders.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allOrders = await orderService.allOrders();

    return NextResponse.json(
      {
        data: allOrders,
        message: "Successfully get orders",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in get orders",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const order = await orderService.createOrder(body);

    return NextResponse.json(
      {
        data: order,
        message: "Order created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in create order",
      },
      { status: 500 }
    );
  }
}