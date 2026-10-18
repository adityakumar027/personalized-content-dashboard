"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCategory } from "@/store/preferencesSlice";
import { ALL_CATEGORIES } from "@/lib/types";

export default function SettingsPanel() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.preferences.categories);

  return (
    <section aria-label="Settings" className="fade-in">
      <h2 className="mb-4 text-xl font-semibold">Preferences</h2>
      <div className="card max-w-lg p-6">
        <h3 className="mb-2 font-medium">Favorite categories</h3>
        <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
          Your feed is personalized to these categories. They persist across visits.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((c) => {
            const on = selected.includes(c);
            return (
              <button
                key={c}
                aria-pressed={on}
                onClick={() => dispatch(toggleCategory(c))}
                className="rounded-full border px-4 py-1.5 text-sm font-medium capitalize"
                style={
                  on
                    ? { background: "var(--accent)", color: "var(--accent-contrast)", borderColor: "var(--accent)" }
                    : { borderColor: "var(--border)", color: "var(--text)" }
                }
              >
                {c}
              </button>
            );
          })}
        </div>
        <h3 className="mb-2 mt-8 font-medium">API keys (optional)</h3>
        <p className="mb-3 text-sm" style={{ color: "var(--text-muted)" }}>
          Add your own NewsAPI / TMDB keys for live data. Keys stay in your browser's localStorage
          and are never sent anywhere else. Without keys, the app uses bundled sample data.
        </p>
        <ApiKeyField label="NewsAPI key" storageKey="pcd_newsapi_key" />
        <ApiKeyField label="TMDB key" storageKey="pcd_tmdb_key" />
      </div>
    </section>
  );
}

function ApiKeyField({ label, storageKey }: { label: string; storageKey: string }) {
  return (
    <input
      aria-label={label}
      type="password"
      placeholder={label}
      defaultValue={typeof window !== "undefined" ? window.localStorage.getItem(storageKey) ?? "" : ""}
      onChange={(e) => window.localStorage.setItem(storageKey, e.target.value)}
      className="mb-2 w-full rounded border px-3 py-2 text-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
    />
  );
}
