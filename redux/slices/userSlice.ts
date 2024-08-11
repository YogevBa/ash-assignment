import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface UserState {
  fullName: string | null;
}

const initialState: UserState = {
  fullName: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
    clearUser: state => {
      state.fullName = null;
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.fullName;
export default userSlice.reducer;
