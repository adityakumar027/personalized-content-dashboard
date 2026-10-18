"use client";

import { motion } from "framer-motion";
import { ContentItem } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/favoritesSlice";

const TYPE_BADGE: Record<ContentItem["type"], string> = {
  news: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  recommendation: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  social: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
};

export default function ContentCard({ item }: { item: ContentItem }) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((s) => Boolean(s.favorites.items[item.id]));

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
      data-testid={`content-card-${item.id}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.imageUrl} alt="" className="h-40 w-full object-cover" loading="lazy" />
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-medium ${TYPE_BADGE[item.type]}`}>
            {item.type}
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            {item.source} · {formatRelativeTime(item.publishedAt)}
          </span>
          <button
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            onClick={() => dispatch(toggleFavorite(item))}
            className="ml-auto text-lg leading-none"
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>
        <h3 className="mb-1 font-semibold leading-snug">{item.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm" style={{ color: "var(--text-muted)" }}>
          {item.description}
        </p>
        <a
          href={item.ctaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-md px-3 py-1.5 text-sm font-medium"
          style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
        >
          {item.ctaLabel}
        </a>
      </div>
    </motion.article>
  );
}
