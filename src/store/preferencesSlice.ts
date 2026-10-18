import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPreferences, Category } from "@/lib/types";

export const DEFAULT_PREFERENCES: UserPreferences = {
  categories: ["technology", "sports", "finance", "entertainment", "science"],
  darkMode: false,
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: DEFAULT_PREFERENCES,
  reducers: {
    toggleCategory(state, action: PayloadAction<Category>) {
      const c = action.payload;
      if (state.categories.includes(c)) {
        // Never allow zero categories.
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((x) => x !== c);
        }
      } else {
        state.categories.push(c);
      }
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      if (action.payload.length > 0) state.categories = action.payload;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    hydrate(state, action: PayloadAction<Partial<UserPreferences>>) {
      if (action.payload.categories?.length) state.categories = action.payload.categories;
      if (typeof action.payload.darkMode === "boolean") state.darkMode = action.payload.darkMode;
    },
  },
});

export const { toggleCategory, setCategories, setDarkMode, hydrate } = preferencesSlice.actions;
export default preferencesSlice.reducer;
