"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAdminJson } from "@/lib/admin-client";
import {
  AdminApiResponse,
  readAdminResponse,
  readProductFormData,
  setProductFeedback,
} from "@/lib/admin-crud";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  color: string;
  size: string[] | null;
  stock: number;
  imageUrl: string | null;
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    color: "",
    size: "",
    stock: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function getProduct() {
      try {
        const result = await fetchAdminJson<Product>(`/api/products/${id}`);
        const product = result.data;
        if (!product) {
          throw new Error("Product not found.");
        }

        if (cancelled) return;
        setForm({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          color: product.color,
          size: product.size?.join(", ") ?? "",
          stock: String(product.stock),
          imageUrl: product.imageUrl ?? "",
        });
        setLoadError(null);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load product.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) {
      getProduct();
    }
    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setSaving(true);
    setSaveError(null);

    let successMessage: string | null = null;
    try {
      const body = readProductFormData(formData);
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await readAdminResponse<AdminApiResponse<Product>>(
        res,
        "Failed to update product.",
      );
      if (!result.data.id) {
        throw new Error("The server did not return the updated product.");
      }
      successMessage = result.warning
        ? `Product updated. ${result.warning}`
        : "Product updated.";
    } catch (error) {
      console.error(error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to update product.",
      );
    } finally {
      setSaving(false);
    }

    if (successMessage) {
      setProductFeedback(successMessage);
      router.push("/admin/products");
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="page-title">Edit product</h1>
          <p className="page-description">Loading product details…</p>
        </div>
        <section
          className="panel mx-auto w-full max-w-3xl space-y-5 p-5 sm:p-7"
          role="status"
          aria-live="polite"
          aria-label="Loading product"
        >
          <div className="skeleton h-4 w-36 rounded" />
          <div className="skeleton h-10 w-full rounded-lg" />
          <div className="skeleton h-28 w-full rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="skeleton h-10 rounded-lg" />
            <div className="skeleton h-10 rounded-lg" />
            <div className="skeleton h-10 rounded-lg" />
            <div className="skeleton h-10 rounded-lg" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="page-title">Edit product</h1>
          <p className="page-description">
            Update product information in your store catalog.
          </p>
        </div>
        <Link href="/admin/products" className="secondary-button">
          Back to products
        </Link>
      </section>

      {loadError ? (
        <section className="panel mx-auto w-full max-w-3xl px-6 py-10 text-center">
          <span className="empty-state-icon mx-auto text-base" aria-hidden="true">
            !
          </span>
          <h2 className="mt-4 text-sm font-semibold text-slate-800">
            Couldn’t load product
          </h2>
          <p className="mt-2 text-xs text-slate-500">{loadError}</p>
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
        </section>
      ) : (
      <section className="panel mx-auto w-full max-w-3xl p-5 sm:p-7">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <h2 className="text-sm font-semibold text-slate-800">
            Product details
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Make changes to the details customers see.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          {saveError && (
            <div className="order-feedback error sm:col-span-2" role="alert">
              <span aria-hidden="true">!</span>
              <p className="flex-1">{saveError}</p>
              <button
                type="button"
                aria-label="Dismiss product update error"
                className="rounded px-2 text-sm hover:bg-red-100"
                onClick={() => setSaveError(null)}
              >
                ×
              </button>
            </div>
          )}
          <div className="sm:col-span-2">
            <label htmlFor="product-name" className="field-label">Product name</label>
            <input
              id="product-name"
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="field-control"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="product-description" className="field-label">Description</label>
            <textarea
              id="product-description"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="field-control min-h-[120px] resize-y leading-6"
              required
            />
          </div>

          <div>
            <label htmlFor="product-category" className="field-label">Category</label>
            <input
              id="product-category"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="field-control"
              required
            />
          </div>

          <div>
            <label htmlFor="product-price" className="field-label">Price (৳)</label>
            <input
              id="product-price"
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="field-control"
              required
            />
          </div>

          <div>
            <label htmlFor="product-color" className="field-label">Color</label>
            <input
              id="product-color"
              name="color"
              placeholder="Color"
              value={form.color}
              onChange={handleChange}
              className="field-control"
              required
            />
          </div>

          <div>
            <label htmlFor="product-size" className="field-label">Sizes</label>
            <input
              id="product-size"
              name="size"
              placeholder="S, M, L, XL"
              value={form.size}
              onChange={handleChange}
              className="field-control"
            />
          </div>

          <div>
            <label htmlFor="product-stock" className="field-label">Stock quantity</label>
            <input
              id="product-stock"
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="field-control"
              required
            />
          </div>

          <div>
            <label htmlFor="product-image" className="field-label">Image URL <span className="font-normal text-slate-400">(optional)</span></label>
            <input
              id="product-image"
              name="imageUrl"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={handleChange}
              className="field-control"
            />
          </div>

          <div className="mt-2 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
            <Link href="/admin/products" className="secondary-button">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="primary-button">
              {saving ? "Saving changes…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>
      )}
    </div>
  );
}