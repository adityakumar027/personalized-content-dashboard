import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem, Category } from "@/lib/types";
import { fetchFeed } from "@/lib/api";

export interface ContentState {
  items: ContentItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  hasMore: boolean;
  order: string[]; // user-defined card order (drag-and-drop)
}

const initialState: ContentState = {
  items: [],
  status: "idle",
  error: null,
  page: 1,
  hasMore: true,
  order: [],
};

export const PAGE_SIZE = 6;

export const loadFeed = createAsyncThunk(
  "content/loadFeed",
  async (args: { categories: Category[]; page: number; query?: string }) => {
    return fetchFeed({ categories: args.categories, page: args.page, pageSize: PAGE_SIZE, query: args.query });
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    resetFeed(state) {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
      state.order = [];
    },
    reorderItems(state, action: PayloadAction<string[]>) {
      state.order = action.payload;
    },
    addLiveItem(state, action: PayloadAction<ContentItem>) {
      if (!state.items.some((i) => i.id === action.payload.id)) {
        state.items.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadFeed.fulfilled, (state, action) => {
        state.status = "succeeded";
        const fresh = action.payload.items.filter(
          (i) => !state.items.some((x) => x.id === i.id)
        );
        state.items = action.meta.arg.page === 1 ? action.payload.items : [...state.items, ...fresh];
        state.hasMore = action.payload.hasMore;
        state.page = action.meta.arg.page;
      })
      .addCase(loadFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load content";
      });
  },
});

export const { resetFeed, reorderItems, addLiveItem } = contentSlice.actions;

export function orderedItems(state: { items: ContentItem[]; order: string[] }): ContentItem[] {
  if (state.order.length === 0) return state.items;
  const byId = new Map(state.items.map((i) => [i.id, i]));
  const ordered: ContentItem[] = [];
  for (const id of state.order) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      byId.delete(id);
    }
  }
  return [...ordered, ...byId.values()];
}

export default contentSlice.reducer;
