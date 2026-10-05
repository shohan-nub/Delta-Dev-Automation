const dateOnlyFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatAdminDate(
  value: string | Date | null | undefined,
  includeTime = false,
) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return (includeTime ? dateTimeFormatter : dateOnlyFormatter).format(date);
}

export function formatAdminNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatAdminCurrency(value: number) {
  return currencyFormatter.format(value);
}
