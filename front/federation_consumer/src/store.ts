// import { configureStore, Middleware } from '@reduxjs/toolkit';
// import { combineReducers } from "redux";
//
// import ProviderAuthSlice from 'federation_provider/authSlice';
// import ProviderMessageSlice from 'federation_provider/messageSlice';
// import { api } from 'federation_provider/mainApi';
//
// export const federatedSlices = {
//   messages: ProviderMessageSlice.reducer,
//   auth: ProviderAuthSlice.reducer,
// };
//
//
// const middlewares: Middleware[] = []
//
// // @ts-ignore
// middlewares.push(api.middleware)
//
//
//   const Store = configureStore({
//     reducer: combineReducers({
//       ...federatedSlices,
//     }),
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       immutableCheck: false,
//       serializableCheck: false,
//     }).concat(middlewares),
//   });
//
//
// export type RootState = ReturnType<typeof Store.getState>;
// export type AppDispatch = typeof Store.dispatch;
//
// export default Store;

export {}