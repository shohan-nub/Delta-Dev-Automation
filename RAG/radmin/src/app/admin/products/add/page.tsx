"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: form.price,
        color: form.color.trim(),

        size: form.size
          ? form.size
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

        stock: Number(form.stock),

        imageUrl: form.imageUrl.trim() || null,
      };

      console.log("SENDING PRODUCT:", body);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("API ERROR:", result);

        throw new Error(
          result.error || result.message
        );
      }

      console.log("PRODUCT CREATED:", result);

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-2xl font-bold">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="color"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="size"
          placeholder="Sizes: S, M, L, XL"
          value={form.size}
          onChange={handleChange}
          className="w-full rounded border p-3"
        />

        <input
          name="stock"
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </main>
  );
}