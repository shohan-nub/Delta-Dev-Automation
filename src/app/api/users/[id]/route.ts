import { userService } from "@/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await userService.userById(id);

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: user,
        message: "Successfully get user",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in get user",
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

    const user = await userService.updateUser(id, body);

    return NextResponse.json(
      {
        data: user,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in update user",
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

    const user = await userService.deleteUser(id);

    return NextResponse.json(
      {
        data: user,
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in delete user",
      },
      { status: 500 }
    );
  }
}