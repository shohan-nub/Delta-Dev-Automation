"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchAdminJson } from "@/lib/admin-client";
import {
  formatAdminCurrency,
  formatAdminDate,
  formatAdminNumber,
} from "@/lib/admin-format";

type Customer = {
  id: string;
  name: string | null;
  username: string | null;
  platform: string;
  puserId: string;
  firstSeen: string;
  lastSeen: string;
  createdAt: string;
};

type Order = {
  id: string;
  userId: string;
  totalAmount: string;
};

function getInitials(customer: Customer) {
  const label = customer.name?.trim() || customer.username?.trim() || "Customer";
  return (
    label
      .replace(/^@/, "")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "C"
  );
}

export default function CustomerDetailsPage() {
  const params = useParams<{ id: string }>();
  const customerId = params.id;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomer() {
      try {
        const [customerResult, ordersResult] = await Promise.all([
          fetchAdminJson<Customer>(`/api/users/${customerId}`),
          fetchAdminJson<Order[]>("/api/orders"),
        ]);
        if (!customerResult.data) {
          throw new Error("Customer profile was not found.");
        }
        if (!Array.isArray(ordersResult.data)) {
          throw new Error("The server returned invalid order data.");
        }

        if (!cancelled) {
          setCustomer(customerResult.data);
          setCustomerOrders(
            ordersResult.data.filter(
              (order: Order) => order.userId === customerId,
            ),
          );
        }
      } catch (loadError) {
        console.error("Failed to load customer profile:", loadError);
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load customer profile.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCustomer();

    return () => {
      cancelled = true;
    };
  }, [customerId, retryCount]);

  const totalSpent = useMemo(() => customerOrders.reduce((sum, order) => {
    const amount = Number(order.totalAmount);
    return Number.isFinite(amount) ? sum + amount : sum;
  }, 0), [customerOrders]);

  if (loading) {
    return (
      <div className="admin-page">
        <div>
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton mt-3 h-8 w-52 rounded" />
          <div className="skeleton mt-3 h-3 w-64 max-w-full rounded" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="panel space-y-4 p-6">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-9 w-20 rounded" />
          </div>
          <div className="panel space-y-4 p-6">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-9 w-20 rounded" />
          </div>
        </div>
        <div
          className="panel space-y-5 p-6"
          role="status"
          aria-live="polite"
          aria-label="Loading customer details"
        >
          <div className="skeleton h-4 w-40 rounded" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="space-y-2">
                <div className="skeleton h-2.5 w-20 rounded" />
                <div className="skeleton h-3 w-32 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="admin-page">
        <Link href="/admin/customers" className="secondary-button w-fit">
          ← Back to customers
        </Link>
        <div className="panel px-6 py-10 text-center">
          <span className="empty-state-icon mx-auto text-base" aria-hidden="true">
            !
          </span>
          <h1 className="mt-4 text-sm font-semibold text-slate-800">
            Couldn’t load customer
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            {error || "Customer profile was not found."}
          </p>
          {error && (
            <button
              type="button"
              className="secondary-button mt-5"
              onClick={() => {
                setLoading(true);
                setError(null);
                setRetryCount((count) => count + 1);
              }}
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  const details = [
    { label: "Name", value: customer.name || "Unnamed customer" },
    {
      label: "Username",
      value: customer.username
        ? `@${customer.username.replace(/^@/, "")}`
        : "—",
    },
    { label: "Platform", value: customer.platform, capitalize: true },
    { label: "Platform user ID", value: customer.puserId, mono: true },
    { label: "First seen", value: formatAdminDate(customer.firstSeen, true) },
    { label: "Last seen", value: formatAdminDate(customer.lastSeen, true) },
    { label: "Created at", value: formatAdminDate(customer.createdAt, true) },
  ];

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <Link
            href="/admin/customers"
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-medium text-slate-500 transition hover:text-violet-700"
          >
            <span aria-hidden="true">←</span>
            All customers
          </Link>
          <p className="eyebrow">Customer profile</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-sm font-semibold text-indigo-700">
              {getInitials(customer)}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                {customer.name || "Unnamed customer"}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                {customer.username
                  ? `@${customer.username.replace(/^@/, "")} · `
                  : ""}
                <span className="capitalize">{customer.platform}</span>
              </p>
            </div>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-500">
          Customer since {formatAdminDate(customer.createdAt)}
        </span>
      </section>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Customer order statistics">
        <article className="panel p-5">
          <div className="flex items-start justify-between">
            <span className="dashboard-stat-icon blue" aria-hidden="true">
              #
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
              Lifetime
            </span>
          </div>
          <p className="mt-5 text-xs font-medium text-slate-500">Total orders</p>
          <p className="mt-1 text-[28px] font-semibold tracking-[-0.05em] text-slate-900">
            {formatAdminNumber(customerOrders.length)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Orders associated with this customer
          </p>
        </article>
        <article className="panel p-5">
          <div className="flex items-start justify-between">
            <span className="dashboard-stat-icon green" aria-hidden="true">
              ৳
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
              Lifetime
            </span>
          </div>
          <p className="mt-5 text-xs font-medium text-slate-500">Total spent</p>
          <p className="mt-1 text-[28px] font-semibold tracking-[-0.05em] text-slate-900">
            ৳{formatAdminCurrency(totalSpent)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Combined value of the customer’s orders
          </p>
        </article>
      </section>

      <section className="panel">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-[13px] font-semibold text-slate-800">
            Customer information
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Account and activity details
          </p>
        </div>
        <dl className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.label} className="min-w-0">
              <dt className="customer-meta-label">{detail.label}</dt>
              <dd
                className={`mt-2 break-words text-xs font-medium text-slate-700${detail.mono ? " font-mono" : ""}${detail.capitalize ? " capitalize" : ""}`}
              >
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
