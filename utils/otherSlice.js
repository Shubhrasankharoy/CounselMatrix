import { createSlice } from "@reduxjs/toolkit";


const otherSlice = createSlice({
    name: "other",
    initialState: {
        darkMode: false        
    },
    reducers: {
        toggleDarkMode(state) {
            state.darkMode = !state.darkMode;
        },
    },
})

export const { toggleDarkMode } = otherSlice.actions;
export default otherSlice.reducer;