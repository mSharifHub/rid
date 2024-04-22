import React, { useReducer, useMemo } from "react";
import { UserContext } from "./UserContext";
import { UserReducer } from "./UserReducer";

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const initialState = {
    userName: "",
    userEmail: "",
  };

  const [state, dispatch] = useReducer(UserReducer, initialState);

  return (
    <UserContext.Provider
      value={useMemo(() => ({ state, dispatch }), [state, dispatch])}
    >
      {children}
    </UserContext.Provider>
  );
};
