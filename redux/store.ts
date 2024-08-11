import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import expensesReducer from './slices/expensesSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    expenses: expensesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
