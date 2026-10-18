"use client";

import { useAppSelector } from "@/store/hooks";
import ContentCard from "./ContentCard";

export default function FavoritesSection() {
  const favorites = useAppSelector((s) => Object.values(s.favorites.items));

  return (
    <section aria-label="Favorites" className="fade-in">
      <h2 className="mb-4 text-xl font-semibold">Your favorites</h2>
      {favorites.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          Nothing saved yet. Tap the ♡ on any card to keep it here.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
