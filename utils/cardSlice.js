import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: "card",
  initialState: {
    items: [],
  },
  reducers: {
    addPreference(state, action) {
      const item = action.payload;
      if (!state.items.some(i => i.id === item.id)) {
        state.items.push(item);
      }
    },
    addPreferences(state, action) {
      const items = action.payload;
      items.forEach(item => {
        if (!state.items.some(i => i.id === item.id)) {
          state.items.push(item);
        }
      });
    },
    removePreference(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    reorderPreference(state, action) {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex === toIndex) return;
      const items = [...state.items];
      const [moved] = items.splice(fromIndex, 1);
      if (!moved) return;
      items.splice(toIndex, 0, moved);
      state.items = items;
    },
    clearPreferences(state) {
      state.items = [];
    },
  },
});

export const {
  addPreference,
  addPreferences,
  removePreference,
  reorderPreference,
  clearPreferences,
} = cardSlice.actions;

export default cardSlice.reducer;
