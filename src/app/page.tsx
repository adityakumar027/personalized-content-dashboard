"use client";

import { useEffect, useState } from "react";
import Sidebar, { Section } from "@/components/Sidebar";
import Header from "@/components/Header";
import Feed from "@/components/Feed";
import TrendingSection from "@/components/TrendingSection";
import FavoritesSection from "@/components/FavoritesSection";
import SettingsPanel from "@/components/SettingsPanel";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const [section, setSection] = useState<Section>("feed");
  const [query, setQuery] = useState("");
  const darkMode = useAppSelector((s) => s.preferences.darkMode);
  const allItems = useAppSelector((s) => s.content.items);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="flex min-h-screen">
      <Sidebar active={section} onNavigate={setSection} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onSearch={setQuery} />
        <main className="flex-1 p-6">
          {section === "feed" && <Feed query={query} />}
          {section === "trending" && <TrendingSection items={allItems} />}
          {section === "favorites" && <FavoritesSection />}
          {section === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}
