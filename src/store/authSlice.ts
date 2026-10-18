import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/types";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = { user: null };

// Mock authentication for the bonus feature: any name/email signs in locally.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    signOut(state) {
      state.user = null;
    },
    hydrateAuth(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
});

export const { signIn, signOut, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
