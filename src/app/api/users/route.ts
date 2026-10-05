import { userService } from "@/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allUsers = await userService.allUsers();

    return NextResponse.json(
      {
        data: allUsers,
        message: "Successfully get users",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in get users",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await userService.createUser(body);

    return NextResponse.json(
      {
        data: user,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return NextResponse.json(
      {
        message: "Problem in create user",
      },
      { status: 500 }
    );
  }
}