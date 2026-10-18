export type Category = "technology" | "sports" | "finance" | "entertainment" | "science";

export type ContentType = "news" | "recommendation" | "social";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  imageUrl: string;
  category: Category;
  source: string;
  publishedAt: string; // ISO date
  score: number; // used for trending
  ctaLabel: string;
  ctaUrl: string;
}

export interface UserPreferences {
  categories: Category[];
  darkMode: boolean;
}

export interface User {
  name: string;
  email: string;
}

export const ALL_CATEGORIES: Category[] = ["technology", "sports", "finance", "entertainment", "science"];
