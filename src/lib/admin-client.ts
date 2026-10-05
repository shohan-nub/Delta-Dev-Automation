type ApiResponse<T> = {
  data: T;
  message?: string;
};

const pendingGets = new Map<string, Promise<unknown>>();

export function fetchAdminJson<T>(url: string): Promise<ApiResponse<T>> {
  const existing = pendingGets.get(url);
  if (existing) {
    return existing as Promise<ApiResponse<T>>;
  }

  const request = (async () => {
    const response = await fetch(url);
    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw new Error("The server returned an unreadable response.");
    }

    if (!response.ok) {
      const message =
        typeof payload === "object" &&
        payload !== null &&
        "details" in payload &&
        typeof payload.details === "string"
          ? payload.details
          : typeof payload === "object" &&
              payload !== null &&
              "error" in payload &&
              typeof payload.error === "string"
            ? payload.error
            : typeof payload === "object" &&
                payload !== null &&
                "message" in payload &&
                typeof payload.message === "string"
              ? payload.message
          : `Request failed (${response.status}).`;

      throw new Error(message);
    }

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("data" in payload)
    ) {
      throw new Error("The server returned an invalid response.");
    }

    return payload as ApiResponse<T>;
  })();

  pendingGets.set(url, request);
  void request.finally(() => {
    if (pendingGets.get(url) === request) {
      pendingGets.delete(url);
    }
  }).catch(() => {
    // The original request promise is handled by its caller.
  });

  return request;
}
