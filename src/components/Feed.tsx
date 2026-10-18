"use client";

import { useCallback, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadFeed, resetFeed, reorderItems, orderedItems, addLiveItem } from "@/store/contentSlice";
import { LIVE_POSTS } from "@/lib/mockData";
import ContentCard from "./ContentCard";

export default function Feed({ query }: { query: string }) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.preferences.categories);
  const { status, error, hasMore, page } = useAppSelector((s) => s.content);
  const items = useAppSelector((s) => orderedItems(s.content));
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const liveIndex = useRef(0);

  // Load + reload when preferences or the debounced search query change.
  useEffect(() => {
    dispatch(resetFeed());
    dispatch(loadFeed({ categories, page: 1, query }));
  }, [dispatch, categories, query]);

  // Infinite scrolling: fetch the next page when the sentinel enters the viewport.
  const loadMore = useCallback(() => {
    if (status !== "loading" && hasMore) {
      dispatch(loadFeed({ categories, page: page + 1, query }));
    }
  }, [dispatch, status, hasMore, categories, page, query]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Bonus: simulated real-time feed - a new post arrives every 45s.
  useEffect(() => {
    const t = setInterval(() => {
      const post = LIVE_POSTS[liveIndex.current % LIVE_POSTS.length];
      liveIndex.current += 1;
      dispatch(addLiveItem({ ...post, publishedAt: new Date().toISOString() }));
    }, 45000);
    return () => clearInterval(t);
  }, [dispatch]);

  return (
    <section aria-label="Personalized feed" className="fade-in">
      <h2 className="mb-1 text-xl font-semibold">Your feed</h2>
      <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
        Drag cards to reorder them. Scroll for more.
      </p>
      {status === "failed" && (
        <div role="alert" className="card mb-4 border-red-300 p-4 text-sm text-red-600">
          Could not load content: {error}. Showing sample data may still work - try again.
          <button
            className="ml-3 underline"
            onClick={() => dispatch(loadFeed({ categories, page: 1, query }))}
          >
            Retry
          </button>
        </div>
      )}
      {items.length === 0 && status === "succeeded" && (
        <p data-testid="empty-feed" style={{ color: "var(--text-muted)" }}>
          No content matches{query ? ` "${query}"` : ""}. Try different categories in Settings.
        </p>
      )}
      <Reorder.Group
        axis="y"
        values={items.map((i) => i.id)}
        onReorder={(ids) => dispatch(reorderItems(ids))}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        as="div"
      >
        {items.map((item) => (
          <Reorder.Item key={item.id} value={item.id} as="div" whileDrag={{ scale: 1.03 }}>
            <ContentCard item={item} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {status === "loading" && (
        <div className="mt-6 flex justify-center" aria-label="Loading">
          <div className="spinner" />
        </div>
      )}
      <div ref={sentinelRef} data-testid="feed-sentinel" className="h-4" />
    </section>
  );
}
