import { NextResponse } from "next/server";
import { PayloadValidationError } from "./admin-crud";

export function apiErrorResponse(error: unknown, operation: string) {
  console.error(`${operation}:`, error);

  const status =
    error instanceof PayloadValidationError || error instanceof SyntaxError
      ? 400
      : 500;
  const message =
    error instanceof PayloadValidationError
      ? error.message
      : error instanceof SyntaxError
        ? "Request body must contain valid JSON."
      : "The request could not be completed.";

  return NextResponse.json(
    {
      message,
      ...(process.env.NODE_ENV !== "production" && {
        details: error instanceof Error ? error.message : String(error),
      }),
    },
    { status },
  );
}
