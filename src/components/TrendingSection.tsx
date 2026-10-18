"use client";

import { useState } from "react";
import { ContentItem, Category, ALL_CATEGORIES } from "@/lib/types";
import { trendingItems } from "@/lib/utils";
import ContentCard from "./ContentCard";

export default function TrendingSection({ items }: { items: ContentItem[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const trending = trendingItems(items, category === "all" ? undefined : category);

  return (
    <section aria-label="Trending" className="fade-in">
      <h2 className="mb-4 text-xl font-semibold">Trending now</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", ...ALL_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className="rounded-full border px-3 py-1 text-xs font-medium capitalize"
            style={
              category === c
                ? { background: "var(--accent)", color: "var(--accent-contrast)", borderColor: "var(--accent)" }
                : { borderColor: "var(--border)" }
            }
          >
            {c}
          </button>
        ))}
      </div>
      {trending.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>Nothing trending in this category yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {trending.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
