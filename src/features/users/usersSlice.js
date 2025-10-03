import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return await res.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateUser: (state, action) => {
      const idx = state.items.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
