"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AdminApiResponse,
  readAdminResponse,
  readProductFormData,
  setProductFeedback,
} from "@/lib/admin-crud";

type Product = {
  id: string;
};

export default function AddProductPage() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    let successMessage: string | null = null;
    try {
      const body = readProductFormData(new FormData(e.currentTarget));

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await readAdminResponse<AdminApiResponse<Product>>(
        res,
        "Failed to create product.",
      );
      if (!result.data.id) {
        throw new Error("The server did not return the saved product.");
      }
      successMessage = result.warning
        ? `Product added. ${result.warning}`
        : "Product added.";
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    } finally {
      setLoading(false);
    }

    if (successMessage) {
      setProductFeedback(successMessage);
      router.push("/admin/products");
    }
  }

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="page-title">Add product</h1>
          <p className="page-description">
            Create a new item for your store catalog.
          </p>
        </div>
        <Link href="/admin/products" className="secondary-button">
          Back to products
        </Link>
      </section>

      <section className="panel mx-auto w-full max-w-3xl p-5 sm:p-7">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <h2 className="text-sm font-semibold text-slate-800">
            Product details
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Add the information customers need to know about this item.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          {error && (
            <div className="order-feedback error sm:col-span-2" role="alert">
              <span aria-hidden="true">!</span>
              <p className="flex-1">{error}</p>
              <button
                type="button"
                aria-label="Dismiss product creation error"
                className="rounded px-2 text-sm hover:bg-red-100"
                onClick={() => setError(null)}
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
              placeholder="e.g. Everyday cotton shirt"
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
              placeholder="Describe the product..."
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
              placeholder="e.g. Apparel"
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
              placeholder="0.00"
              type="number"
              step="0.01"
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
              placeholder="e.g. Navy"
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
              placeholder="0"
              type="number"
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
            <button type="submit" disabled={loading} className="primary-button">
              {loading ? "Adding product…" : "Add product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}