"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const navigation = [
  { label: "Overview", href: "/admin", icon: "grid" },
  { label: "Products", href: "/admin/products", icon: "box" },
  { label: "Knowledge", href: "/admin/knowledge", icon: "spark" },
  { label: "Orders", href: "/admin/orders", icon: "receipt" },
  { label: "Customers", href: "/admin/customers", icon: "users" },
] as const;

const subscribeToHydration = () => () => {};
const getHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;
type NavigationIconName = (typeof navigation)[number]["icon"];

const iconPaths: Record<NavigationIconName, React.ReactNode> = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" />
      <path d="m3.8 7.6 8.2 4.6 8.2-4.6M12 12.2V21" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.5h12v17l-3-1.8-3 1.8-3-1.8-3 1.8v-17Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  users: (
    <>
      <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M17 11a3.5 3.5 0 0 0 0-7M21 20v-1.5a4 4 0 0 0-3-3.87" />
    </>
  ),
};

function NavigationIcon({ name }: { name: NavigationIconName }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[19px] w-[19px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  );
}

function isActivePath(pathname: string | null, href: string) {
  return Boolean(
    pathname &&
      (pathname === href ||
        (href !== "/admin" && pathname.startsWith(`${href}/`))),
  );
}

export default function AdminNavigation({
  variant = "sidebar",
}: {
  variant?: "sidebar" | "mobile" | "breadcrumb";
}) {
  const pathname = usePathname();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const hydratedPath = isHydrated ? pathname : null;

  if (variant === "breadcrumb") {
    const currentPage =
      navigation.find((item) => isActivePath(hydratedPath, item.href))?.label ??
      "Admin";

    return (
      <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
        <span>Workspace</span>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-800">{currentPage}</span>
      </div>
    );
  }

  const mobile = variant === "mobile";

  return (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={mobile ? "admin-mobile-nav" : "admin-nav"}
    >
      {navigation.map((item) => {
        const active = isActivePath(hydratedPath, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            title={item.label}
            aria-current={active ? "page" : undefined}
            className={
              mobile
                ? `admin-mobile-link${active ? " is-active" : ""}`
                : `admin-nav-link${active ? " is-active" : ""}`
            }
          >
            <NavigationIcon name={item.icon} />
            <span>{item.label}</span>
            {!mobile && active && <span className="admin-nav-indicator" />}
          </Link>
        );
      })}
    </nav>
  );
}
