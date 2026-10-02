"use client";

import { useEffect, useState } from "react";

type Knowledge = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

export default function KnowledgePage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [knowledges, setKnowledges] = useState<Knowledge[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Load all knowledge
    useEffect(() => {
        let cancelled = false;

        async function loadKnowledges() {
            try {
                const response = await fetch("/api/knowledge");

                if (!response.ok) {
                    throw new Error("Failed to fetch knowledge");
                }

                const result = await response.json();

                const data = result.data ?? result;

                if (!cancelled) {
                    setKnowledges(Array.isArray(data) ? data : []);
                    setLoadingList(false);
                }
            } catch (error) {
                console.error("Failed to load knowledge:", error);

                if (!cancelled) {
                    setLoadingList(false);
                }
            }
        }

        loadKnowledges();

        return () => {
            cancelled = true;
        };
    }, []);

    // Create knowledge
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/knowledge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();

                console.error("Create knowledge failed:", errorData);

                throw new Error("Failed to create knowledge");
            }

            const result = await response.json();

            const newKnowledge = result.data ?? result;

            // Add newly created knowledge to UI
            if (newKnowledge?.id) {
                setKnowledges((prev) => [
                    newKnowledge,
                    ...prev,
                ]);
            }

            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Failed to create knowledge:", error);

            alert("Failed to create knowledge");
        } finally {
            setLoading(false);
        }
    }

    // Delete knowledge
    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this knowledge?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);

            const response = await fetch(
                `/api/knowledge/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorData = await response.text();

                console.error("Delete failed:", errorData);

                throw new Error("Failed to delete knowledge");
            }

            // Remove from UI
            setKnowledges((prev) =>
                prev.filter((item) => item.id !== id)
            );
        } catch (error) {
            console.error("Failed to delete knowledge:", error);

            alert("Failed to delete knowledge");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <main className="max-w-5xl mx-auto p-8 space-y-10">

            {/* Add Knowledge */}
            <section>
                <h1 className="text-3xl font-bold mb-6">
                    Knowledge
                </h1>

                <div className="border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Add Knowledge
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Title */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="Return Policy"
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Content
                            </label>

                            <textarea
                                value={content}
                                onChange={(e) =>
                                    setContent(e.target.value)
                                }
                                placeholder="Write your policy, FAQ or other knowledge..."
                                className="w-full border rounded-lg p-3 min-h-[250px] outline-none focus:ring-2"
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-3 rounded-lg bg-black text-white disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Knowledge"}
                        </button>
                    </form>
                </div>
            </section>

            {/* Knowledge List */}
            <section>
                <h2 className="text-2xl font-bold mb-5">
                    Existing Knowledge
                </h2>

                {loadingList ? (
                    <p className="text-gray-500">
                        Loading...
                    </p>
                ) : knowledges.length === 0 ? (
                    <div className="border rounded-xl p-6 text-gray-500">
                        No knowledge found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {knowledges.map((item) => (
                            <article
                                key={item.id}
                                className="border rounded-xl p-5"
                            >
                                <div className="flex justify-between gap-6">

                                    <div className="flex-1 min-w-0">

                                        <h3 className="text-xl font-semibold">
                                            {item.title}
                                        </h3>

                                        <p className="mt-3 whitespace-pre-wrap text-gray-600">
                                            {item.content}
                                        </p>

                                        <p className="text-sm text-gray-400 mt-4">
                                            Created:{" "}
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(item.id)
                                        }
                                        disabled={
                                            deletingId === item.id
                                        }
                                        className="h-fit px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                                    >
                                        {deletingId === item.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

        </main>
    );
}