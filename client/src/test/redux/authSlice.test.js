import authReducer, { login, logout, updateUser } from "../../redux/authSlice";

describe("authSlice reducer", () => {
  const initialState = {
    isAuthenticated: false,
    user: null,
  };

  it("should return the initial state when no action is passed", () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle login action", () => {
    const userPayload = {
      user: { username: "testuser", profileImage: "image.jpg" },
    };
    const newState = authReducer(initialState, login(userPayload));

    expect(newState.isAuthenticated).toBe(true);
    expect(newState.user).toEqual(userPayload.user);
  });

  it("should handle logout action", () => {
    const loggedInState = {
      isAuthenticated: true,
      user: { username: "testuser", profileImage: "image.jpg" },
    };

    const newState = authReducer(loggedInState, logout());

    expect(newState.isAuthenticated).toBe(false);
    expect(newState.user).toBeNull();
  });

  it("should handle updateUser action", () => {
    const currentState = {
      isAuthenticated: true,
      user: { username: "testuser", profileImage: "image.jpg" },
    };

    const updatePayload = {
      username: "newusername",
      profileImage: "newimage.jpg",
    };
    const newState = authReducer(currentState, updateUser(updatePayload));

    expect(newState.user.username).toBe(updatePayload.username);
    expect(newState.user.profileImage).toBe(updatePayload.profileImage);
  });

  it("should not update user when no user exists in state", () => {
    const updatePayload = {
      username: "newusername",
      profileImage: "newimage.jpg",
    };
    const newState = authReducer(initialState, updateUser(updatePayload));

    expect(newState.user).toBeNull();
  });
});
