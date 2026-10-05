"use client";

import { useEffect, useState } from "react";
import { fetchAdminJson } from "@/lib/admin-client";
import { formatAdminDate } from "@/lib/admin-format";
import ConfirmDialog from "../confirm-dialog";
import {
  AdminApiResponse,
  readAdminResponse,
  readKnowledgeFormData,
} from "@/lib/admin-crud";

type Knowledge = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function KnowledgePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [deleteCandidate, setDeleteCandidate] = useState<Knowledge | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
      kind: "success" | "error";
      message: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadKnowledges() {
      try {
        const result = await fetchAdminJson<Knowledge[]>("/api/knowledge");
        const data = result.data;

        if (!cancelled) {
          if (!Array.isArray(data)) {
            throw new Error("The server returned an invalid knowledge list.");
          }
          setKnowledges(data);
          setLoadError(null);
          setLoadingList(false);
        }
      } catch (error) {
        console.error("Failed to load knowledge:", error);

        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load knowledge entries.",
          );
          setLoadingList(false);
        }
      }
    }

    loadKnowledges();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);
      setActionFeedback(null);
      const payload = readKnowledgeFormData(formData);

      const response = await fetch(
        editingId ? `/api/knowledge/${editingId}` : "/api/knowledge",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await readAdminResponse<AdminApiResponse<Knowledge>>(
        response,
        editingId ? "Failed to update knowledge." : "Failed to create knowledge.",
      );
      const savedKnowledge = result.data;
      if (!savedKnowledge?.id) {
        throw new Error("The server did not return the saved knowledge entry.");
      }

      setKnowledges((prev) =>
        editingId
          ? prev.map((item) =>
              item.id === editingId ? savedKnowledge : item,
            )
          : [savedKnowledge, ...prev],
      );

      setTitle("");
      setContent("");
      setEditingId(null);
      setActionFeedback({
          kind: "success",
          message: [
            editingId ? "Knowledge entry updated." : "Knowledge entry saved.",
            result.warning,
          ]
            .filter(Boolean)
            .join(" "),
      });
    } catch (error) {
      console.error("Failed to save knowledge:", error);
      setActionFeedback({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Failed to save knowledge.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);

      const response = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
      });

      await readAdminResponse(response, "Failed to delete knowledge.");

      setKnowledges((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) cancelKnowledgeEdit();
      setActionFeedback({
        kind: "success",
        message: "Knowledge entry deleted.",
      });
    } catch (error) {
      console.error("Failed to delete knowledge:", error);
      setActionFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "Failed to delete knowledge.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function confirmDeleteKnowledge() {
    if (!deleteCandidate) return;

    void handleDelete(deleteCandidate.id).finally(() =>
      setDeleteCandidate(null),
    );
  }

  function editKnowledge(item: Knowledge) {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setActionFeedback(null);
    document.getElementById("knowledge-title")?.focus();
  }

  function cancelKnowledgeEdit() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">AI resources</p>
          <h1 className="page-title">Knowledge</h1>
          <p className="page-description">
            Give your assistant the information it needs to help your customers.
          </p>
        </div>
        {!loadingList && !loadError && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-600">
            {knowledges.length} {knowledges.length === 1 ? "entry" : "entries"}
          </span>
        )}
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.4fr)]">
        <section className="panel p-5 sm:p-6">
          {actionFeedback && (
            <div
              className={`order-feedback ${actionFeedback.kind}`}
              role={actionFeedback.kind === "error" ? "alert" : "status"}
            >
              <span aria-hidden="true">
                {actionFeedback.kind === "success" ? "✓" : "!"}
              </span>
              <p className="flex-1">{actionFeedback.message}</p>
              <button
                type="button"
                className="rounded px-2 text-sm hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                aria-label="Dismiss knowledge message"
                onClick={() => setActionFeedback(null)}
              >
                ×
              </button>
            </div>
          )}
          <div className="mb-5 flex items-start gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-sm text-violet-600" aria-hidden="true">
              ✳
            </span>
            <div>
              <h2 className="text-[13px] font-semibold text-slate-800">
                {editingId ? "Edit knowledge" : "Add knowledge"}
              </h2>
              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                Add a policy, answer, or reference.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="knowledge-title" className="field-label">
                Title
              </label>
              <input
                id="knowledge-title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Returns and refunds"
                className="field-control"
                required
              />
            </div>

            <div>
              <label htmlFor="knowledge-content" className="field-label">
                Content
              </label>
              <textarea
                id="knowledge-content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your policy, FAQ, or other helpful information..."
                className="field-control min-h-[210px] resize-y leading-6"
                required
              />
              <p className="mt-2 text-[10px] leading-4 text-slate-400">
                Keep the information clear and easy to understand.
              </p>
            </div>

            <button type="submit" disabled={loading} className="primary-button w-full">
              {loading ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {editingId ? "Updating entry…" : "Saving entry…"}
                </>
              ) : (
                <>
                  <span aria-hidden="true" className="text-base leading-none">＋</span>
                  {editingId ? "Update knowledge" : "Save knowledge"}
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                disabled={loading}
                onClick={cancelKnowledgeEdit}
                className="secondary-button w-full"
              >
                Cancel edit
              </button>
            )}
          </form>
        </section>

        <section className="panel">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-[13px] font-semibold text-slate-800">
                Saved entries
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Information available to your assistant
              </p>
            </div>
            {!loadingList && !loadError && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                {knowledges.length}
              </span>
            )}
          </div>

          {loadingList ? (
            <div
              className="space-y-5 p-5 sm:p-6"
              role="status"
              aria-live="polite"
              aria-label="Loading knowledge"
            >
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="space-y-3">
                  <div className="skeleton h-3 w-44 rounded" />
                  <div className="skeleton h-2.5 w-full rounded" />
                  <div className="skeleton h-2.5 w-4/5 rounded" />
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
                  Couldn’t load knowledge entries
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
                  {loadError}
                </p>
                <button
                  type="button"
                  className="secondary-button mt-5"
                  onClick={() => {
                    setLoadingList(true);
                    setLoadError(null);
                    setRetryCount((count) => count + 1);
                  }}
                >
                  Try again
                </button>
              </div>
            </div>
          ) : knowledges.length === 0 ? (
            <div className="empty-state">
              <div>
                <span className="empty-state-icon mx-auto text-lg" aria-hidden="true">
                  ✳
                </span>
                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                  No knowledge entries yet
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
                  Add your first answer or policy using the form.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {knowledges.map((item) => (
                <article key={item.id} className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[13px] font-semibold text-slate-800">
                          {item.title}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">
                          Saved
                        </span>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-slate-600">
                        {item.content}
                      </p>
                      <p className="mt-4 text-[10px] text-slate-400">
                        Added{" "}
                        {formatAdminDate(item.created_at, true)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => editKnowledge(item)}
                        disabled={loading || deletingId === item.id}
                        className="secondary-button min-h-8 px-3 text-[10px]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(item)}
                        disabled={deletingId === item.id}
                        className="danger-button min-h-8 px-3 text-[10px]"
                      >
                        {deletingId === item.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      <ConfirmDialog
        open={deleteCandidate !== null}
        title="Delete this knowledge entry?"
        description={
          deleteCandidate
            ? `Are you sure you want to delete “${deleteCandidate.title}”? This action cannot be undone.`
            : "Are you sure you want to delete this knowledge entry?"
        }
        pending={
          deleteCandidate ? deletingId === deleteCandidate.id : false
        }
        onConfirm={confirmDeleteKnowledge}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
