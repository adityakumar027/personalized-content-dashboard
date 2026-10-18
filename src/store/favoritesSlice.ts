import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem } from "@/lib/types";

interface FavoritesState {
  items: Record<string, ContentItem>;
}

const initialState: FavoritesState = { items: {} };

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<ContentItem>) {
      const item = action.payload;
      if (state.items[item.id]) {
        delete state.items[item.id];
      } else {
        state.items[item.id] = item;
      }
    },
    hydrateFavorites(state, action: PayloadAction<Record<string, ContentItem>>) {
      state.items = action.payload ?? {};
    },
  },
});

export const { toggleFavorite, hydrateFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
