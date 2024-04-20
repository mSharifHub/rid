import React, { createContext, useContext } from "react";

export interface UserState {
  userName: string;
  userEmail: string;
  isLoggedIn: boolean;
  rides: any[];
  balance: number;
}

interface ContextType {
  state: UserState;
  dispatch: React.Dispatch<any>;
}

export const UserContext = createContext<ContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContext.Provider");
  }
  return context;
};
