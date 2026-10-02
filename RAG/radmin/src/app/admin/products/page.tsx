"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function getProducts() {
    try {
      const res = await fetch("/api/products");
      const result = await res.json();

      setProducts(result.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return <main className="p-8">Loading...</main>;
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Product Management
        </h1>

        <Link
          href="/admin/products/add"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded border p-4"
            >
              <div>
                <h2 className="font-bold">{product.name}</h2>

                <p>Category: {product.category}</p>
                <p>Price: {product.price}</p>
                <p>Color: {product.color}</p>
                <p>Stock: {product.stock}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded border px-3 py-2"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="rounded bg-red-600 px-3 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}