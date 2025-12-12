import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { chatApi } from './chatApi';
import commonReducer from './chatSlice';

export const store = configureStore({
    reducer: combineReducers({
        common: commonReducer,
        [chatApi.reducerPath]: chatApi.reducer,
    }),
    middleware: getDefault => getDefault().concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
