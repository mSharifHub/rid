import { UserState } from "./UserContext.ts";

type Action =
  | {
      type: "SET_USER";
      payload: {
        userName: string;
        userEmail: string;
      };
    }
  | { type: "LOG_OUT" };

export const UserReducer = (state: UserState, action: Action): UserState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        userName: action.payload.userName,
        userEmail: action.payload.userEmail,
      };

    case "LOG_OUT":
      return {
        ...state,
        userName: "",
        userEmail: "",
      };
    default:
      return state;
  }
};
