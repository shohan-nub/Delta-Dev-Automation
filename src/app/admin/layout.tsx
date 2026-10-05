import AdminNavigation from "./navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell min-h-screen">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="admin-brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold tracking-tight text-white">
              Studio
            </span>
            <span className="mt-0.5 block text-[11px] tracking-wide text-slate-400">
              COMMERCE ADMIN
            </span>
          </span>
        </Link>

        <p className="admin-nav-label">Workspace</p>
        <AdminNavigation />

        <div className="admin-sidebar-bottom">
          <div className="admin-live-card">
            <span className="admin-workspace-dot" aria-hidden="true">✦</span>
            <div>
              <p className="text-xs font-medium text-white">Store workspace</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Everything in one place
              </p>
            </div>
          </div>
          <p className="px-3 pt-5 text-[11px] text-slate-500">
            © 2026 Studio Commerce
          </p>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div className="admin-mobile-brand">
            <span className="admin-brand-mark small" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="text-sm font-semibold text-slate-900">Studio</span>
          </div>
          <AdminNavigation variant="breadcrumb" />
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Store workspace
            </span>
            <span className="admin-avatar" role="img" aria-label="Admin account">
              A
            </span>
          </div>
        </header>
        <AdminNavigation variant="mobile" />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
