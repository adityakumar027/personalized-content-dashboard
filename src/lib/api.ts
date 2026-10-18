import { ContentItem, Category, ContentType } from "./types";
import { MOCK_ITEMS } from "./mockData";

// API keys are read from localStorage (Settings panel) or build-time env.
// They are never committed to the repo; without keys we fall back to rich mock data.
function readKey(storageKey: string, envKey: string | undefined): string | null {
  if (typeof window !== "undefined") {
    const v = window.localStorage.getItem(storageKey);
    if (v) return v;
  }
  return envKey ?? null;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mapNewsApiArticle(a: any, category: Category): ContentItem {
  return {
    id: `newsapi-${a.url ?? a.title}`,
    type: "news",
    title: a.title ?? "Untitled",
    description: a.description ?? "",
    imageUrl: a.urlToImage ?? `https://picsum.photos/seed/${encodeURIComponent(a.title ?? "news")}/640/360`,
    category,
    source: a.source?.name ?? "NewsAPI",
    publishedAt: a.publishedAt ?? new Date().toISOString(),
    score: 60,
    ctaLabel: "Read More",
    ctaUrl: a.url ?? "#",
  };
}

function mapTmdbMovie(m: any, category: Category): ContentItem {
  return {
    id: `tmdb-${m.id}`,
    type: "recommendation",
    title: m.title ?? m.name ?? "Untitled",
    description: m.overview ?? "",
    imageUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : `https://picsum.photos/seed/tmdb${m.id}/640/360`,
    category,
    source: "TMDB",
    publishedAt: m.release_date ? `${m.release_date}T00:00:00Z` : new Date().toISOString(),
    score: Math.round((m.vote_average ?? 5) * 10),
    ctaLabel: "Play Now",
    ctaUrl: `https://www.themoviedb.org/movie/${m.id}`,
  };
}

export interface FetchOptions {
  categories: Category[];
  page: number;
  pageSize: number;
  query?: string;
  type?: ContentType | "all";
}

export interface FetchResult {
  items: ContentItem[];
  hasMore: boolean;
}

export async function fetchNews(categories: Category[]): Promise<ContentItem[]> {
  const key = readKey("pcd_newsapi_key", process.env.NEXT_PUBLIC_NEWSAPI_KEY);
  if (key) {
    const results = await Promise.all(
      categories.map(async (cat) => {
        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${cat === "entertainment" ? "entertainment" : cat}&language=en&pageSize=10&apiKey=${key}`
        );
        if (!res.ok) throw new Error(`NewsAPI error ${res.status}`);
        const data = await res.json();
        return (data.articles ?? []).map((a: any) => mapNewsApiArticle(a, cat));
      })
    );
    return results.flat();
  }
  await delay(250); // simulate latency
  return MOCK_ITEMS.filter((i) => i.type === "news" && categories.includes(i.category));
}

export async function fetchRecommendations(categories: Category[]): Promise<ContentItem[]> {
  const key = readKey("pcd_tmdb_key", process.env.NEXT_PUBLIC_TMDB_KEY);
  if (key) {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${key}`
    );
    if (!res.ok) throw new Error(`TMDB error ${res.status}`);
    const data = await res.json();
    return (data.results ?? []).slice(0, 12).map((m: any) => mapTmdbMovie(m, "entertainment"));
  }
  await delay(250);
  return MOCK_ITEMS.filter((i) => i.type === "recommendation" && categories.includes(i.category));
}

export async function fetchSocial(categories: Category[]): Promise<ContentItem[]> {
  // Social APIs generally require OAuth; this mock stands in for that source by design.
  await delay(200);
  return MOCK_ITEMS.filter((i) => i.type === "social" && categories.includes(i.category));
}

export async function fetchFeed(options: FetchOptions): Promise<FetchResult> {
  const { categories, page, pageSize, query, type } = options;
  let pool: ContentItem[];
  try {
    const [news, recs, social] = await Promise.all([
      fetchNews(categories),
      fetchRecommendations(categories),
      fetchSocial(categories),
    ]);
    pool = [...news, ...recs, ...social];
  } catch (err) {
    // Network or API-key failure: degrade gracefully to bundled data.
    pool = MOCK_ITEMS.filter((i) => categories.includes(i.category));
  }

  if (type && type !== "all") pool = pool.filter((i) => i.type === type);

  const q = query?.trim().toLowerCase();
  if (q) {
    pool = pool.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.source.toLowerCase().includes(q)
    );
  }

  pool = [...pool].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const start = (page - 1) * pageSize;
  const items = pool.slice(start, start + pageSize);
  return { items, hasMore: start + pageSize < pool.length };
}
