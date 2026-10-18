"use client";

export type Section = "feed" | "trending" | "favorites" | "settings";

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: "feed", label: "My Feed", icon: "⌂" },
  { id: "trending", label: "Trending", icon: "↗" },
  { id: "favorites", label: "Favorites", icon: "♥" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: Section;
  onNavigate: (s: Section) => void;
}) {
  return (
    <nav
      aria-label="Dashboard sections"
      className="w-48 shrink-0 border-r p-4"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <ul className="space-y-1">
        {NAV.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onNavigate(item.id)}
              aria-current={active === item.id ? "page" : undefined}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
              style={
                active === item.id
                  ? { background: "var(--accent)", color: "var(--accent-contrast)" }
                  : { color: "var(--text)" }
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
