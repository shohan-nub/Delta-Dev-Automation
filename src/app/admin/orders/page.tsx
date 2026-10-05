"use client";

import { useEffect, useState } from "react";
import { fetchAdminJson } from "@/lib/admin-client";
import { formatAdminDate } from "@/lib/admin-format";
import ConfirmDialog from "../confirm-dialog";

type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: string;
  createdAt: string;
};

const orderStatusOptions = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const paymentStatusOptions = ["pending", "paid", "failed", "refunded"] as const;

type StatusField = "orderStatus" | "paymentStatus";
type StatusFeedback = { kind: "success" | "error"; message: string };

function statusTone(status: string) {
  const normalized = status.toLowerCase();

  if (
    ["complete", "completed", "delivered", "paid", "success", "confirmed"].some(
      (value) => normalized.includes(value),
    )
  ) {
    return "success";
  }

  if (
    ["pending", "processing", "unpaid", "awaiting"].some((value) =>
      normalized.includes(value),
    )
  ) {
    return "pending";
  }

  if (["cancel", "failed", "refund", "reject"].some((value) => normalized.includes(value))) {
    return "alert";
  }

  return "neutral";
}

function StatusSelect({
  value,
  options,
  label,
  disabled,
  onChange,
}: {
  value: string;
  options: readonly string[];
  label: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className={`status-badge ${statusTone(value)} status-select`}>
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="status-select-chevron">
        ▾
      </span>
    </label>
  );
}

function OrderSkeleton() {
  return (
    <div
      className="divide-y divide-slate-100"
      role="status"
      aria-live="polite"
      aria-label="Loading orders"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-5 sm:px-6">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton h-3 w-32 rounded" />
            <div className="skeleton h-2.5 w-48 max-w-full rounded" />
          </div>
          <div className="skeleton hidden h-6 w-20 rounded-full sm:block" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Set<string>>(() => new Set());
  const [deleting, setDeleting] = useState<Set<string>>(() => new Set());
  const [feedback, setFeedback] = useState<StatusFeedback | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [deleteCandidate, setDeleteCandidate] = useState<Order | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function getOrders() {
      try {
        const result = await fetchAdminJson<Order[]>("/api/orders");
        if (!Array.isArray(result.data)) {
          throw new Error("The server returned an invalid order list.");
        }

        if (!cancelled) {
          setOrders(result.data);
          setLoadError(null);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load orders.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getOrders();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  async function updateStatus(
    orderId: string,
    field: StatusField,
    value: string,
  ) {
    const updateKey = `${orderId}:${field}`;

    setUpdating((current) => new Set(current).add(updateKey));
    setFeedback(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update order status.");
      }

      if (!result.data) {
        throw new Error("The server did not return the updated order.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, ...result.data } : order,
        ),
      );
      setFeedback({
        kind: "success",
        message: field === "orderStatus"
          ? "Order status updated."
          : "Payment status updated.",
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
      setFeedback({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update order status. Please try again.",
      });
    } finally {
      setUpdating((current) => {
        const next = new Set(current);
        next.delete(updateKey);
        return next;
      });
    }
  }

  async function deleteOrder(orderId: string) {
    setDeleting((current) => new Set(current).add(orderId));
    setFeedback(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete this order.");
      }

      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.id !== orderId),
      );
      setFeedback({
        kind: "success",
        message: "Order deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete order:", error);
      setFeedback({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete this order. Please try again.",
      });
    } finally {
      setDeleting((current) => {
        const next = new Set(current);
        next.delete(orderId);
        return next;
      });
    }
  }

  function confirmDeleteOrder() {
    if (!deleteCandidate) return;

    void deleteOrder(deleteCandidate.id).finally(() => setDeleteCandidate(null));
  }

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Store activity</p>
          <h1 className="page-title">Orders</h1>
          <p className="page-description">
            Keep track of customer purchases and payment progress.
          </p>
        </div>
        {!loading && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-600">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        )}
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[13px] font-semibold text-slate-800">
              All orders
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              {loading ? "Fetching recent activity" : "Customer order details"}
            </p>
          </div>
          {!loading && !loadError && (
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Up to date
            </span>
          )}
        </div>

        {feedback && (
          <div
            className={`order-feedback ${feedback.kind}`}
            role={feedback.kind === "error" ? "alert" : "status"}
          >
            <span aria-hidden="true">{feedback.kind === "success" ? "✓" : "!"}</span>
            {feedback.message}
          </div>
        )}

        {loading ? (
          <OrderSkeleton />
        ) : loadError ? (
          <div className="empty-state">
            <div>
              <span className="empty-state-icon mx-auto text-base" aria-hidden="true">
                !
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                Couldn’t load orders
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
                {loadError}
              </p>
              <button
                type="button"
                className="secondary-button mt-5"
                onClick={() => {
                  setLoading(true);
                  setLoadError(null);
                  setRetryCount((count) => count + 1);
                }}
              >
                Try again
              </button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div>
              <span className="empty-state-icon mx-auto text-lg" aria-hidden="true">
                ↗
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No orders to show
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
                New customer orders will appear here when they come in.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className="hidden overflow-x-auto lg:block"
              role="region"
              aria-label="Orders table"
              tabIndex={0}
            >
              <table className="w-full min-w-[940px] text-left">
                <thead className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Order date</th>
                    <th className="px-4 py-3.5">Total</th>
                    <th className="px-4 py-3.5">Payment</th>
                    <th className="px-4 py-3.5">Order status</th>
                    <th className="px-6 py-3.5">Delivery address</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-700">
                            {order.customerName
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-800">
                              {order.customerName}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">
                              {order.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600">
                        {formatAdminDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-800">
                        ৳{order.totalAmount}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-medium text-slate-600">
                            {order.paymentMethod}
                          </p>
                          <StatusSelect
                            value={order.paymentStatus}
                            options={paymentStatusOptions}
                            label={`Payment status for ${order.customerName}`}
                            disabled={
                              updating.has(`${order.id}:paymentStatus`) ||
                              deleting.has(order.id)
                            }
                            onChange={(value) =>
                              updateStatus(order.id, "paymentStatus", value)
                            }
                          />
                          {updating.has(`${order.id}:paymentStatus`) && (
                            <span className="status-saving">Saving…</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <StatusSelect
                            value={order.orderStatus}
                            options={orderStatusOptions}
                            label={`Order status for ${order.customerName}`}
                            disabled={
                              updating.has(`${order.id}:orderStatus`) ||
                              deleting.has(order.id)
                            }
                            onChange={(value) =>
                              updateStatus(order.id, "orderStatus", value)
                            }
                          />
                          {updating.has(`${order.id}:orderStatus`) && (
                            <span className="status-saving">Saving…</span>
                          )}
                        </div>
                      </td>
                      <td className="max-w-[220px] px-6 py-4 text-[11px] leading-5 text-slate-500">
                        {order.address}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(order)}
                          disabled={
                            deleting.has(order.id) ||
                            updating.has(`${order.id}:orderStatus`) ||
                            updating.has(`${order.id}:paymentStatus`)
                          }
                          className="danger-button min-h-8 px-3 text-[11px]"
                        >
                          {deleting.has(order.id) ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
              {orders.map((order) => (
                <article key={order.id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-700">
                        {order.customerName
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-xs font-semibold text-slate-800">
                          {order.customerName}
                        </h3>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {order.phone}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate-800">
                      ৳{order.totalAmount}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Order status
                      </p>
                      <StatusSelect
                        value={order.orderStatus}
                        options={orderStatusOptions}
                        label={`Order status for ${order.customerName}`}
                        disabled={
                          updating.has(`${order.id}:orderStatus`) ||
                          deleting.has(order.id)
                        }
                        onChange={(value) =>
                          updateStatus(order.id, "orderStatus", value)
                        }
                      />
                      {updating.has(`${order.id}:orderStatus`) && (
                        <span className="status-saving">Saving…</span>
                      )}
                    </div>
                    <div>
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Payment
                      </p>
                      <StatusSelect
                        value={order.paymentStatus}
                        options={paymentStatusOptions}
                        label={`Payment status for ${order.customerName}`}
                        disabled={
                          updating.has(`${order.id}:paymentStatus`) ||
                          deleting.has(order.id)
                        }
                        onChange={(value) =>
                          updateStatus(order.id, "paymentStatus", value)
                        }
                      />
                      {updating.has(`${order.id}:paymentStatus`) && (
                        <span className="status-saving">Saving…</span>
                      )}
                    </div>
                    <div>
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Method
                      </p>
                      <p className="text-[11px] text-slate-600">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Date
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {formatAdminDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Delivery address
                      </p>
                      <p className="text-[11px] leading-5 text-slate-600">{order.address}</p>
                    </div>
                    <div className="col-span-2 flex justify-end border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(order)}
                        disabled={
                          deleting.has(order.id) ||
                          updating.has(`${order.id}:orderStatus`) ||
                          updating.has(`${order.id}:paymentStatus`)
                        }
                        className="danger-button min-h-9 w-full sm:w-auto"
                      >
                        {deleting.has(order.id) ? "Deleting order…" : "Delete order"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
      <ConfirmDialog
        open={deleteCandidate !== null}
        title="Are you sure you want to delete this order?"
        description={
          deleteCandidate
            ? `Order for ${deleteCandidate.customerName} will be permanently removed. This action cannot be undone.`
            : "This order will be permanently removed. This action cannot be undone."
        }
        pending={deleteCandidate ? deleting.has(deleteCandidate.id) : false}
        onConfirm={confirmDeleteOrder}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
