"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchAdminJson } from "@/lib/admin-client";
import { formatAdminDate, formatAdminNumber } from "@/lib/admin-format";

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

function initials(name: string | null, username: string | null) {
  const label = name?.trim() || username?.trim() || "Customer";
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

function isActiveToday(lastSeen: string) {
  const lastActive = new Date(lastSeen);
  if (Number.isNaN(lastActive.getTime())) return false;

  const today = new Date();
  return (
    lastActive.getUTCFullYear() === today.getUTCFullYear() &&
    lastActive.getUTCMonth() === today.getUTCMonth() &&
    lastActive.getUTCDate() === today.getUTCDate()
  );
}

function CustomersLoading() {
  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading customers">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="panel space-y-3 p-5">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-8 w-20 rounded" />
            <div className="skeleton h-2.5 w-36 rounded" />
          </div>
        ))}
      </div>
      <div className="panel space-y-4 p-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="skeleton h-10 w-10 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="skeleton h-3 w-36 rounded" />
              <div className="skeleton h-2.5 w-24 rounded" />
            </div>
            <div className="skeleton hidden h-3 w-20 rounded sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      try {
        const result = await fetchAdminJson<Customer[]>("/api/users");
        if (!Array.isArray(result.data)) {
          throw new Error("The server returned an invalid customer list.");
        }

        if (!cancelled) {
          setCustomers(result.data);
          setError(null);
        }
      } catch (loadError) {
        console.error("Failed to fetch customers:", loadError);
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load customers.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCustomers();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter((customer) =>
      [customer.name, customer.username, customer.platform]
        .some((value) => value?.toLowerCase().includes(query)),
    );
  }, [customers, search]);

  const activeToday = useMemo(
    () =>
      customers.filter((customer) => isActiveToday(customer.lastSeen)).length,
    [customers],
  );

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Relationships</p>
          <h1 className="page-title">Customers</h1>
          <p className="page-description">
            Get to know your customer base and how they connect with your store.
          </p>
        </div>
      </section>

      {loading ? (
        <CustomersLoading />
      ) : error ? (
        <div className="panel px-6 py-8 text-center">
          <span className="empty-state-icon mx-auto text-base" aria-hidden="true">
            !
          </span>
          <h2 className="mt-4 text-sm font-semibold text-slate-800">
            Couldn’t load customers
          </h2>
          <p className="mt-2 text-xs text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setLoading(true);
              setRetryCount((count) => count + 1);
            }}
            className="secondary-button mt-5"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2" aria-label="Customer statistics">
            <article className="panel p-5">
              <div className="flex items-start justify-between">
                <span className="dashboard-stat-icon violet" aria-hidden="true">
                  C
                </span>
                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
                  All time
                </span>
              </div>
              <p className="mt-5 text-xs font-medium text-slate-500">
                Total customers
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-[-0.05em] text-slate-900">
                {formatAdminNumber(customers.length)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Customer accounts in your workspace
              </p>
            </article>
            <article className="panel p-5">
              <div className="flex items-start justify-between">
                <span className="dashboard-stat-icon green" aria-hidden="true">
                  ↗
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Today
                </span>
              </div>
              <p className="mt-5 text-xs font-medium text-slate-500">
                Active customers today
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-[-0.05em] text-slate-900">
                {formatAdminNumber(activeToday)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Based on each customer’s last seen date
              </p>
            </article>
          </section>

          <section className="panel">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-800">
                  Customer directory
                </h2>
                <p className="mt-1 text-[11px] text-slate-400">
                  {filteredCustomers.length}{" "}
                  {filteredCustomers.length === 1 ? "customer" : "customers"}
                  {search.trim() ? " matching your search" : " in your directory"}
                </p>
              </div>
              <div className="customer-search">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="h-4 w-4 shrink-0"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <input
                  type="search"
                  aria-label="Search customers by name, username, or platform"
                  placeholder="Search customers…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear customer search"
                    onClick={() => setSearch("")}
                    className="customer-search-clear"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="empty-state">
                <div>
                  <span className="empty-state-icon mx-auto text-lg" aria-hidden="true">
                    {search ? "⌕" : "C"}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-slate-800">
                    {search ? "No customers match that search" : "No customers yet"}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
                    {search
                      ? "Try a different name, username, or platform."
                      : "Customers will appear here when they connect with your store."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="hidden overflow-x-auto xl:block"
                  role="region"
                  aria-label="Customer directory table"
                  tabIndex={0}
                >
                  <table className="w-full min-w-[1120px] text-left">
                    <thead className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      <tr>
                        <th className="px-6 py-3.5">Customer</th>
                        <th className="px-4 py-3.5">Username</th>
                        <th className="px-4 py-3.5">Platform</th>
                        <th className="px-4 py-3.5">Platform user ID</th>
                        <th className="px-4 py-3.5">First seen</th>
                        <th className="px-4 py-3.5">Last seen</th>
                        <th className="px-4 py-3.5">Created at</th>
                        <th className="px-6 py-3.5 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="transition-colors hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4">
                            <Link
                              href={`/admin/customers/${customer.id}`}
                              className="group flex items-center gap-3"
                            >
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-700">
                                {initials(customer.name, customer.username)}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-xs font-semibold text-slate-800 group-hover:text-violet-700">
                                  {customer.name || "Unnamed customer"}
                                </span>
                                <span className="mt-1 block text-[10px] text-slate-400">
                                  Customer profile
                                </span>
                              </span>
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-600">
                            {customer.username ? `@${customer.username.replace(/^@/, "")}` : "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-600">
                              {customer.platform}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-mono text-[11px] text-slate-500">
                            {customer.puserId}
                          </td>
                          <td className="px-4 py-4 text-[11px] text-slate-600">
                            {formatAdminDate(customer.firstSeen)}
                          </td>
                          <td className="px-4 py-4 text-[11px] text-slate-600">
                            {formatAdminDate(customer.lastSeen)}
                          </td>
                          <td className="px-4 py-4 text-[11px] text-slate-600">
                            {formatAdminDate(customer.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/admin/customers/${customer.id}`}
                              className="secondary-button min-h-8 px-3 text-[10px]"
                            >
                              View profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-slate-100 xl:hidden">
                  {filteredCustomers.map((customer) => (
                    <article key={customer.id} className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-700">
                          {initials(customer.name, customer.username)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-xs font-semibold text-slate-800">
                            {customer.name || "Unnamed customer"}
                          </h3>
                          <p className="mt-1 truncate text-[11px] text-slate-500">
                            {customer.username
                              ? `@${customer.username.replace(/^@/, "")}`
                              : "No username"}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-600">
                          {customer.platform}
                        </span>
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50/80 p-3 sm:grid-cols-3">
                        <div className="col-span-2 sm:col-span-3">
                          <dt className="customer-meta-label">Platform user ID</dt>
                          <dd className="mt-1 break-all font-mono text-[10px] text-slate-600">
                            {customer.puserId}
                          </dd>
                        </div>
                        <div>
                          <dt className="customer-meta-label">First seen</dt>
                          <dd className="mt-1 text-[10px] text-slate-600">
                            {formatAdminDate(customer.firstSeen)}
                          </dd>
                        </div>
                        <div>
                          <dt className="customer-meta-label">Last seen</dt>
                          <dd className="mt-1 text-[10px] text-slate-600">
                            {formatAdminDate(customer.lastSeen)}
                          </dd>
                        </div>
                        <div>
                          <dt className="customer-meta-label">Created at</dt>
                          <dd className="mt-1 text-[10px] text-slate-600">
                            {formatAdminDate(customer.createdAt)}
                          </dd>
                        </div>
                      </dl>
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="secondary-button mt-3 w-full"
                      >
                        View customer profile
                      </Link>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
