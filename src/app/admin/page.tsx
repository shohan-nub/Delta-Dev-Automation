import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { knowledge } from "@/db/schema/knowledge";
import { users } from "@/db/schema/users";
import { orders } from "@/db/schema/orders";
import { count } from "drizzle-orm";
import { formatAdminNumber } from "@/lib/admin-format";

export default async function AdminDashboard() {
  const [[productCount], [knowledgeCount], [userCount], [orderCount]] =
    await Promise.all([
      db.select({ count: count() }).from(products),
      db.select({ count: count() }).from(knowledge),
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(orders),
    ]);

  const stats = [
    {
      title: "Products",
      value: productCount.count,
      description: "Items in your catalog",
      href: "/admin/products",
      icon: "P",
      color: "violet",
    },
    {
      title: "Knowledge entries",
      value: knowledgeCount.count,
      description: "Resources for your AI",
      href: "/admin/knowledge",
      icon: "K",
      color: "blue",
    },
    {
      title: "Orders",
      value: orderCount.count,
      description: "Orders received",
      href: "/admin/orders",
      icon: "O",
      color: "amber",
    },
    {
      title: "Customers",
      value: userCount.count,
      description: "Registered accounts",
      href: "/admin/customers",
      icon: "C",
      color: "green",
    },
  ];

  const actions = [
    {
      title: "Add a product",
      description: "Grow your catalog with a new item.",
      href: "/admin/products/add",
      label: "Create product",
      icon: "＋",
    },
    {
      title: "Update knowledge",
      description: "Keep helpful answers and policies current.",
      href: "/admin/knowledge",
      label: "Manage knowledge",
      icon: "✳",
    },
    {
      title: "Review orders",
      description: "See the latest orders from your customers.",
      href: "/admin/orders",
      label: "View orders",
      icon: "↗",
    },
  ];

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1 className="page-title">Good to see you.</h1>
          <p className="page-description">
            A quick overview of your catalog, customer knowledge, and orders.
          </p>
        </div>
        <Link href="/admin/products/add" className="primary-button">
          <span aria-hidden="true" className="text-base leading-none">＋</span>
          Add product
        </Link>
      </section>

      <section aria-label="Workspace statistics">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-slate-800">
            Store overview
          </h2>
          <span className="text-[11px] text-slate-400">All-time totals</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              href={stat.href}
              className="panel group p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`dashboard-stat-icon ${stat.color}`}
                  aria-hidden="true"
                >
                  {stat.icon}
                </span>
                <span className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500">
                  ↗
                </span>
              </div>
              <p className="mt-5 text-[12px] font-medium text-slate-500">
                {stat.title}
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-[-0.05em] text-slate-900">
                {formatAdminNumber(stat.value)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {stat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold tracking-tight text-slate-800">
            Quick actions
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Jump straight into the tools you use most.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="panel group flex min-h-[150px] flex-col justify-between p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-800">
                    {action.title}
                  </h3>
                  <p className="mt-2 max-w-[230px] text-xs leading-5 text-slate-500">
                    {action.description}
                  </p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-lg font-medium text-violet-600 transition group-hover:bg-violet-100">
                  {action.icon}
                </span>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-violet-600">
                {action.label}
                <span className="transition group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
