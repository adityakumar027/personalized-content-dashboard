"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store/store";
import { hydrate } from "@/store/preferencesSlice";
import { hydrateFavorites } from "@/store/favoritesSlice";
import { hydrateAuth } from "@/store/authSlice";

const LS_KEYS = { prefs: "pcd_prefs", favorites: "pcd_favorites", auth: "pcd_auth" };

export default function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();
  const [ready, setReady] = useState(false);

  // Rehydrate persisted state once on mount, then persist on every change.
  useEffect(() => {
    const store = storeRef.current!;
    try {
      const prefs = window.localStorage.getItem(LS_KEYS.prefs);
      if (prefs) store.dispatch(hydrate(JSON.parse(prefs)));
      const favs = window.localStorage.getItem(LS_KEYS.favorites);
      if (favs) store.dispatch(hydrateFavorites(JSON.parse(favs)));
      const auth = window.localStorage.getItem(LS_KEYS.auth);
      if (auth) store.dispatch(hydrateAuth(JSON.parse(auth)));
    } catch {
      // Corrupt storage should never break the app.
    }
    const unsub = store.subscribe(() => {
      const s = store.getState();
      window.localStorage.setItem(LS_KEYS.prefs, JSON.stringify(s.preferences));
      window.localStorage.setItem(LS_KEYS.favorites, JSON.stringify(s.favorites.items));
      window.localStorage.setItem(LS_KEYS.auth, JSON.stringify(s.auth.user));
    });
    setReady(true);
    return unsub;
  }, []);

  if (!ready) return null; // avoids hydration mismatch with persisted state
  return <Provider store={storeRef.current}>{children}</Provider>;
}
