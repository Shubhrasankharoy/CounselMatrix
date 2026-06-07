import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./userSlice";
import otherReducer from "./otherSlice";
import cardReducer from "./cardSlice";

const appStore = configureStore({
  reducer: {
    userDetails: userDetailsReducer,
    other: otherReducer,
    card: cardReducer,
  },
});

export default appStore;