export type ProductPayload = {
  name: string;
  description: string;
  category: string;
  price: string;
  color: string;
  size: string[];
  stock: number;
  imageUrl: string | null;
};

export type KnowledgePayload = {
  title: string;
  content: string;
};

export type AdminApiResponse<T> = {
  data: T;
  message: string;
  warning?: string;
};

export const PRODUCT_FEEDBACK_STORAGE_KEY = "admin-product-feedback";
const PRODUCT_FEEDBACK_EVENT = "admin-product-feedback-change";

export function subscribeToProductFeedback(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PRODUCT_FEEDBACK_EVENT, onChange);
  return () => window.removeEventListener(PRODUCT_FEEDBACK_EVENT, onChange);
}

export function getProductFeedbackSnapshot() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(PRODUCT_FEEDBACK_STORAGE_KEY);
}

export function setProductFeedback(message: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PRODUCT_FEEDBACK_STORAGE_KEY, message);
  window.dispatchEvent(new Event(PRODUCT_FEEDBACK_EVENT));
}

export function clearProductFeedback() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PRODUCT_FEEDBACK_STORAGE_KEY);
  window.dispatchEvent(new Event(PRODUCT_FEEDBACK_EVENT));
}

export class PayloadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PayloadValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  source: Record<string, unknown>,
  field: string,
  options: { required?: boolean; maxLength?: number } = {},
) {
  const value = source[field];
  if (value === undefined && options.required) {
    throw new PayloadValidationError(`${field} is required.`);
  }
  if (value === undefined && !options.required) return undefined;
  if (typeof value !== "string") {
    throw new PayloadValidationError(`${field} must be a string.`);
  }

  const normalized = value.trim();
  if (options.required && !normalized) {
    throw new PayloadValidationError(`${field} is required.`);
  }
  if (options.maxLength && normalized.length > options.maxLength) {
    throw new PayloadValidationError(
      `${field} must be ${options.maxLength} characters or fewer.`,
    );
  }
  return normalized;
}

export function parseProductPayload(
  value: unknown,
  partial?: false,
): ProductPayload;
export function parseProductPayload(
  value: unknown,
  partial: true,
): Partial<ProductPayload>;
export function parseProductPayload(value: unknown, partial = false) {
  if (!isRecord(value)) {
    throw new PayloadValidationError("Product data must be a JSON object.");
  }

  const payload: Partial<ProductPayload> = {};
  const required = !partial;
  const name = readString(value, "name", { required, maxLength: 80 });
  const description = readString(value, "description", { required });
  const category = readString(value, "category", { required, maxLength: 90 });
  const priceValue = value.price;
  const color = readString(value, "color", { required, maxLength: 50 });
  const stockValue = value.stock;

  if (name !== undefined) payload.name = name;
  if (description !== undefined) payload.description = description;
  if (category !== undefined) payload.category = category;
  if (color !== undefined) payload.color = color;

  if (priceValue !== undefined) {
    if (
      (typeof priceValue !== "string" && typeof priceValue !== "number") ||
      String(priceValue).trim() === "" ||
      !Number.isFinite(Number(priceValue)) ||
      Number(priceValue) < 0
    ) {
      throw new PayloadValidationError("price must be a non-negative number.");
    }
    payload.price = String(priceValue).trim();
  } else if (required) {
    throw new PayloadValidationError("price is required.");
  }

  if (stockValue !== undefined) {
    const stock = typeof stockValue === "number" ? stockValue : Number(stockValue);
    if (!Number.isInteger(stock) || stock < 0 || String(stockValue).trim() === "") {
      throw new PayloadValidationError("stock must be a non-negative integer.");
    }
    payload.stock = stock;
  } else if (required) {
    throw new PayloadValidationError("stock is required.");
  }

  if (value.size !== undefined) {
    if (
      !Array.isArray(value.size) ||
      !value.size.every((item) => typeof item === "string")
    ) {
      throw new PayloadValidationError("size must be an array of strings.");
    }
    payload.size = value.size.map((item) => item.trim()).filter(Boolean);
  } else if (required) {
    payload.size = [];
  }

  if (value.imageUrl !== undefined) {
    if (value.imageUrl !== null && typeof value.imageUrl !== "string") {
      throw new PayloadValidationError("imageUrl must be a string or null.");
    }
    payload.imageUrl =
      typeof value.imageUrl === "string" && value.imageUrl.trim()
        ? value.imageUrl.trim()
        : null;
  } else if (required) {
    payload.imageUrl = null;
  }

  if (partial && Object.keys(payload).length === 0) {
    throw new PayloadValidationError("Provide at least one product field to update.");
  }

  return partial ? payload : (payload as ProductPayload);
}

export function parseKnowledgePayload(
  value: unknown,
  partial?: false,
): KnowledgePayload;
export function parseKnowledgePayload(
  value: unknown,
  partial: true,
): Partial<KnowledgePayload>;
export function parseKnowledgePayload(value: unknown, partial = false) {
  if (!isRecord(value)) {
    throw new PayloadValidationError("Knowledge data must be a JSON object.");
  }

  const payload: Partial<KnowledgePayload> = {};
  const title = readString(value, "title", { required: !partial, maxLength: 200 });
  const content = readString(value, "content", { required: !partial });

  if (title !== undefined) payload.title = title;
  if (content !== undefined) payload.content = content;
  if (partial && Object.keys(payload).length === 0) {
    throw new PayloadValidationError("Provide a title or content to update.");
  }

  return partial ? payload : (payload as KnowledgePayload);
}

export async function readAdminResponse<T>(
  response: Response,
  fallback: string,
): Promise<T> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(
      response.ok
        ? "The server returned an unreadable response."
        : `${fallback} (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    const record = isRecord(payload) ? payload : {};
    const detail =
      typeof record.details === "string"
        ? record.details
        : typeof record.error === "string"
          ? record.error
          : typeof record.message === "string"
            ? record.message
            : `${fallback} (HTTP ${response.status}).`;
    throw new Error(detail);
  }

  if (
    !isRecord(payload) ||
    !("data" in payload) ||
    typeof payload.message !== "string" ||
    (payload.warning !== undefined && typeof payload.warning !== "string")
  ) {
    throw new Error("The server returned an invalid response.");
  }

  return payload as T;
}

export function readProductFormData(formData: FormData): ProductPayload {
  const size = String(formData.get("size") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parseProductPayload({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
    color: formData.get("color"),
    size,
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
  });
}

export function readKnowledgeFormData(formData: FormData): KnowledgePayload {
  return parseKnowledgePayload({
    title: formData.get("title"),
    content: formData.get("content"),
  });
}
