"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDarkMode } from "@/store/preferencesSlice";
import { signIn, signOut } from "@/store/authSlice";

export default function Header({ onSearch }: { onSearch: (q: string) => void }) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.preferences.darkMode);
  const user = useAppSelector((s) => s.auth.user);
  const [showSignIn, setShowSignIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 border-b px-6 py-3"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <span className="text-lg font-bold" style={{ color: "var(--accent)" }}>
        ContentDash
      </span>
      <div className="flex-1">
        <SearchBar onSearch={onSearch} />
      </div>
      <button
        aria-label="Toggle dark mode"
        onClick={() => dispatch(setDarkMode(!darkMode))}
        className="rounded-lg border px-3 py-2 text-sm"
        style={{ borderColor: "var(--border)" }}
      >
        {darkMode ? "☀ Light" : "☾ Dark"}
      </button>
      {user ? (
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
            aria-label={`Signed in as ${user.name}`}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
          <button className="text-sm underline" onClick={() => dispatch(signOut())}>
            Sign out
          </button>
        </div>
      ) : (
        <button
          className="rounded-lg px-3 py-2 text-sm font-medium"
          style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
          onClick={() => setShowSignIn(true)}
        >
          Sign in
        </button>
      )}
      {showSignIn && (
        <div
          role="dialog"
          aria-label="Sign in"
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40"
          onClick={() => setShowSignIn(false)}
        >
          <form
            className="card w-80 p-6"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim() && email.trim()) {
                dispatch(signIn({ name: name.trim(), email: email.trim() }));
                setShowSignIn(false);
              }
            }}
          >
            <h2 className="mb-4 font-semibold">Sign in (demo)</h2>
            <input
              aria-label="Name"
              className="mb-2 w-full rounded border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              aria-label="Email"
              type="email"
              className="mb-4 w-full rounded border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full rounded-lg py-2 text-sm font-medium"
              style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
            >
              Continue
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
