"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { fetchAdminJson } from "@/lib/admin-client";
import ConfirmDialog from "../confirm-dialog";
import {
  AdminApiResponse,
  clearProductFeedback,
  getProductFeedbackSnapshot,
  readAdminResponse,
  setProductFeedback,
  subscribeToProductFeedback,
} from "@/lib/admin-crud";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  color: string;
  size: string[] | null;
  stock: number;
  imageUrl: string | null;
};

function ProductPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-100 text-xs font-semibold text-violet-700">
      {initials || "P"}
    </span>
  );
}

function getStockStatus(stock: number) {
  if (stock <= 0) return { tone: "alert", label: "Out of stock" };
  if (stock <= 5) return { tone: "pending", label: `Low stock · ${stock}` };
  return { tone: "success", label: `${stock} in stock` };
}

function StockBadge({ stock }: { stock: number }) {
  const status = getStockStatus(stock);

  return <span className={`status-badge ${status.tone}`}>{status.label}</span>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [deleting, setDeleting] = useState<Set<string>>(() => new Set());
  const actionSuccess = useSyncExternalStore(
    subscribeToProductFeedback,
    getProductFeedbackSnapshot,
    () => null,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  async function deleteProduct(id: string) {
    setDeleting((current) => new Set(current).add(id));
    clearProductFeedback();
    setActionError(null);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const result = await readAdminResponse<AdminApiResponse<Product>>(
        res,
        "Failed to delete product.",
      );
      if (result.data.id !== id) {
        throw new Error("The server did not confirm the deleted product.");
      }

      setProducts((prev) => prev.filter((product) => product.id !== id));
      setProductFeedback("Product deleted.");
    } catch (error) {
      console.error(error);
      setActionError(
        error instanceof Error ? error.message : "Failed to delete product.",
      );
    } finally {
      setDeleting((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  function confirmDeleteProduct() {
    if (!deleteCandidate) return;

    void deleteProduct(deleteCandidate.id).finally(() =>
      setDeleteCandidate(null),
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const result = await fetchAdminJson<Product[]>("/api/products");

        if (!Array.isArray(result.data)) {
          throw new Error("The server returned an invalid product list.");
        }

        if (cancelled) return;
        setProducts(result.data ?? []);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load products.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="page-title">Products</h1>
          <p className="page-description">
            Manage the items and details in your store catalog.
          </p>
        </div>
        <Link href="/admin/products/add" className="primary-button">
          <span aria-hidden="true" className="text-base leading-none">＋</span>
          Add product
        </Link>
      </section>

      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[13px] font-semibold text-slate-800">
              Product catalog
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              {loading
                ? "Loading your catalog"
                : loadError
                  ? "Catalog unavailable"
                  : `${products.length} ${products.length === 1 ? "item" : "items"} in your catalog`}
            </p>
          </div>
          {!loading && !loadError && (
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          )}
        </div>

        {actionSuccess && (
          <div className="order-feedback success" role="status">
            <span aria-hidden="true">✓</span>
            <p className="flex-1">{actionSuccess}</p>
            <button
              type="button"
              className="ml-auto rounded px-2 text-sm hover:bg-emerald-100"
              aria-label="Dismiss product success message"
              onClick={clearProductFeedback}
            >
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div className="order-feedback error" role="alert">
            <span aria-hidden="true">!</span>
            <p className="flex-1">{actionError}</p>
            <button
              type="button"
              className="ml-auto rounded px-2 text-sm hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              aria-label="Dismiss product error"
              onClick={() => setActionError(null)}
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div
            className="space-y-4 p-5 sm:p-6"
            role="status"
            aria-live="polite"
            aria-label="Loading products"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div className="flex items-center gap-4" key={index}>
                <div className="skeleton h-11 w-11 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="skeleton h-3 w-36 rounded" />
                  <div className="skeleton h-2.5 w-24 rounded" />
                </div>
                <div className="skeleton hidden h-3 w-16 rounded sm:block" />
                <div className="skeleton h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="empty-state">
            <div>
              <span className="empty-state-icon mx-auto text-base" aria-hidden="true">
                !
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                Couldn’t load products
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                {loadError}
              </p>
              <button
                type="button"
                className="secondary-button mt-5"
                onClick={() => {
                  setLoadError(null);
                  setLoading(true);
                  setRetryCount((count) => count + 1);
                }}
              >
                Try again
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div>
              <span className="empty-state-icon mx-auto text-lg" aria-hidden="true">
                ◇
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                Your catalog is ready for its first product
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                Add a product to start building out your store catalog.
              </p>
              <Link href="/admin/products/add" className="primary-button mt-5">
                Add your first product
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div
              className="hidden overflow-x-auto lg:block"
              role="region"
              aria-label="Product catalog table"
              tabIndex={0}
            >
              <table className="w-full min-w-[780px] text-left">
                <thead className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Stock</th>
                    <th className="px-4 py-3.5">Sizes</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProductPlaceholder name={product.name} />
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-semibold text-slate-800">
                              {product.name}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                              {product.color}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600">
                        {product.category}
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-800">
                        ৳{product.price}
                      </td>
                      <td className="px-4 py-4">
                        <StockBadge stock={product.stock} />
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {product.size?.length ? product.size.join(", ") : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="secondary-button min-h-8 px-3 text-[11px]"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(product)}
                            disabled={deleting.has(product.id)}
                            aria-label={`Delete ${product.name}`}
                            className="danger-button min-h-8 px-3 text-[11px]"
                          >
                            {deleting.has(product.id) ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
              {products.map((product) => (
                <article key={product.id} className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <ProductPlaceholder name={product.name} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[13px] font-semibold text-slate-800">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {product.category} · {product.color}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs font-semibold text-slate-800">
                      ৳{product.price}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <StockBadge stock={product.stock} />
                    <span className="text-[11px] text-slate-400">
                      Sizes: {product.size?.length ? product.size.join(", ") : "—"}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="secondary-button min-h-9 flex-1"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(product)}
                      disabled={deleting.has(product.id)}
                      aria-label={`Delete ${product.name}`}
                      className="danger-button min-h-9 flex-1"
                    >
                      {deleting.has(product.id) ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
      <ConfirmDialog
        open={deleteCandidate !== null}
        title="Delete this product?"
        description={
          deleteCandidate
            ? `Are you sure you want to delete “${deleteCandidate.name}”? This action cannot be undone.`
            : "Are you sure you want to delete this product?"
        }
        pending={deleteCandidate ? deleting.has(deleteCandidate.id) : false}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
