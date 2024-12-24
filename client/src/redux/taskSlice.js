import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = process.env.REACT_APP_BASE_URL;


export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (userId) => {
    const response = await fetch(
      `${API_URL}/today?userId=${userId}`
    );
    const data = await response.json();
    return data;
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ userId, taskId, status }) => {
    const response = await fetch(`${API_URL}/tasks/${userId}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return { taskId, status };
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
  },

  reducers: {
    addTask: (state, action) => {
      state.tasks = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, status } = action.payload;

        if (!state.tasks || !Array.isArray(state.tasks)) {
          console.error("State tasks are undefined or not an array");
          return;
        }

        state.tasks = state.tasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        );

      });
  },
});

export const { addTask } = taskSlice.actions;


export default taskSlice.reducer;
