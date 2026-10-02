"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  useEffect(() => {
    async function getProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const result = await res.json();

        const product = result.data;

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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getProduct();
    }
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          price: form.price,
          color: form.color,
          size: form.size
            ? form.size.split(",").map((item) => item.trim())
            : [],
          stock: Number(form.stock),
          imageUrl: form.imageUrl || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="p-8">Loading...</main>;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-2xl font-bold">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

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
          type="number"
          placeholder="Price"
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
          placeholder="Sizes e.g. S, M, L, XL"
          value={form.size}
          onChange={handleChange}
          className="w-full rounded border p-3"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
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
          disabled={saving}
          className="rounded bg-black px-5 py-3 text-white"
        >
          {saving ? "Saving..." : "Update Product"}
        </button>

      </form>
    </main>
  );
}