import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}

interface ExpensesState {
  expenses: Expense[];
}

const initialState: ExpensesState = {
  expenses: [],
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    editExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(
        exp => exp.id === action.payload.id,
      );
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
    },
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    },
  },
});

export const {addExpense, editExpense, deleteExpense, setExpenses} =
  expensesSlice.actions;
export const selectExpenses = (state: RootState) => state.expenses.expenses;
export default expensesSlice.reducer;
