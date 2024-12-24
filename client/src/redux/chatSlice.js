import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = process.env.REACT_APP_BASE_URL;

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatRoomId) => {
    const response = await fetch(`${API_URL}/chat/messages/${chatRoomId}`);
    const data = await response.json();
    return { chatRoomId, messages: data };
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message) => {
    const response = await fetch(`${API_URL}/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    const savedMessage = await response.json();
    return savedMessage;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedFriend: null,
    chatRoomId: null,
    messages: {},
    status: "idle",
  },

  reducers: {
    addMessage: (state, action) => {
      const { chatRoomId, sender, content, senderName } = action.payload;

      const newMessage = {
        chatRoomId,
        content,
        sender: { _id: sender, username: senderName },
      };
      if (!state.messages[chatRoomId]) {
        state.messages[chatRoomId] = [];
      }
      state.messages[chatRoomId].push(newMessage);
    },
    setSelectedFriend: (state, action) => {
      state.selectedFriend = action.payload;
    },
    setChatRoom: (state, action) => {
      state.chatRoomId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatRoomId, messages } = action.payload;
        state.messages[chatRoomId] = messages;
      })
  },
});

export const { addMessage, setSelectedFriend, setChatRoom } = chatSlice.actions;

export default chatSlice.reducer;
