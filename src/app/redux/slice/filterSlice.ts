import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  status: 'All',
  priority: '',
  tag: 'All',  // Add tag state
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetFilter: () => initialState,
  },
});

export const { setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;