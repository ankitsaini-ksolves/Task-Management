import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (userId) => {
    const response = await fetch(
      `http://localhost:5000/today?userId=${userId}`
    );
    const data = await response.json();
    return data;
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ userId, taskId, status }) => {
    const response = await fetch(
      `http://localhost:5000/tasks/${userId}/${taskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );
    const data = await response.json();
    return { taskId, status }; // Only return taskId and status
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
  },
  
  reducers: {},
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
        state.status = "succeeded";

        const { taskId, status } = action.payload;

        for (const taskList of state.tasks) {
          const task = taskList.tasks.find((task) => task._id === taskId);
          if (task) {
            task.status = status;
            break;
          }
        }
      });
  },
});

export default taskSlice.reducer;
