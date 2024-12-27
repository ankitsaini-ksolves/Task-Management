import chatReducer, {
  addMessage,
  setSelectedFriend,
  setChatRoom,
  fetchMessages,
  sendMessage,
} from "../../redux/chatSlice";
import { configureStore } from "@reduxjs/toolkit";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("chatSlice reducer", () => {
  const initialState = {
    selectedFriend: null,
    chatRoomId: null,
    messages: {},
    status: "idle",
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should return the initial state when no action is passed", () => {
    expect(chatReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle addMessage action", () => {
    const messagePayload = {
      chatRoomId: "123",
      sender: "user1",
      content: "Hello!",
      senderName: "User One",
    };
    const newState = chatReducer(initialState, addMessage(messagePayload));

    expect(newState.messages["123"]).toHaveLength(1);
    expect(newState.messages["123"][0]).toEqual({
      chatRoomId: "123",
      content: "Hello!",
      sender: { _id: "user1", username: "User One" },
    });
  });

  it("should handle setSelectedFriend action", () => {
    const friend = { id: "friend1", name: "Friend One" };
    const newState = chatReducer(initialState, setSelectedFriend(friend));

    expect(newState.selectedFriend).toEqual(friend);
  });

  it("should handle setChatRoom action", () => {
    const chatRoomId = "123";
    const newState = chatReducer(initialState, setChatRoom(chatRoomId));

    expect(newState.chatRoomId).toBe(chatRoomId);
  });

  it("should handle fetchMessages.fulfilled action", async () => {
    const chatRoomId = "123";
    const messages = [{ id: "msg1", content: "Hi!", sender: { _id: "user1" } }];
    fetchMock.mockResponseOnce(JSON.stringify(messages));

    const store = configureStore({ reducer: chatReducer });

    await store.dispatch(fetchMessages(chatRoomId));

    const state = store.getState();
    expect(state.messages[chatRoomId]).toEqual(messages);
  });

  it("should handle sendMessage action", async () => {
    const newMessage = {
      chatRoomId: "123",
      content: "Hello!",
      sender: "user1",
    };
    fetchMock.mockResponseOnce(JSON.stringify(newMessage));

    const store = configureStore({ reducer: chatReducer });

    await store.dispatch(sendMessage(newMessage));

    const state = store.getState();
    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_BASE_URL}/chat/messages`,
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
