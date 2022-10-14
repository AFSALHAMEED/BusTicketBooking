import { combineReducers,configureStore } from "@reduxjs/toolkit";
import alertsSlice from "./alertsSlice";
import userSlice from "./userSlice";

const rootReducer=combineReducers({
    alerts:alertsSlice,
    users:userSlice
})
const store = configureStore({
    reducer:rootReducer
})

export default store