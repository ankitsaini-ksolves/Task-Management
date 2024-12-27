import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import FriendsPage from "../../pages/Friends";
import { fetchMessages } from "../../redux/chatSlice";
import thunk from "redux-thunk";
import { applyMiddleware } from "@reduxjs/toolkit";

const mockStore = configureMockStore(applyMiddleware(thunk));

describe("FriendsPage component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { userId: "123", username: "John" },
      },
      chat: {
        selectedFriend: null,
      },
    });
  });

  it("should render Friends, ChatBody placeholder, and Users components", () => {
    render(
      <Provider store={store}>
        <FriendsPage />
      </Provider>
    );

    expect(
      screen.getByText("Select a friend to start chatting!")
    ).toBeInTheDocument();
  });

  it("should render ChatBody and ChatFooter when a friend is selected", () => {
    store = mockStore({
      auth: {
        user: { userId: "123", username: "John" },
      },
      chat: {
        selectedFriend: { id: "friend1", name: "Friend One" },
        chatRoomId: "12345_67",
        messages: {},
      },
    });

    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <FriendsPage />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(fetchMessages("12345_67"));

    expect(
      screen.queryByText("Select a friend to start chatting!")
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "ChatBody" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "ChatFooter" })
    ).toBeInTheDocument();
  });
});
