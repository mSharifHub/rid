import React, { useReducer, useMemo } from "react";
import { UserContext } from "./UserContext";
import { UserReducer } from "./UserReducer";
// import { Auth, Amplify, API } from "aws-amplify";

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const initialState = {
    userId: "",
    userName: "",
    userEmail: "",
    rides: [],
    balance: 0,
    isLoggedIn: false,
  };

  const [state, dispatch] = useReducer(UserReducer, initialState);

  // useEffect(() => {
  //   const checkAuthState = async () => {
  //     try {
  //       const user = await Auth.currentAuthenticatedUser();
  //       dispatch({
  //         type: "SET_USER",
  //         payload: {
  //           userName: user.userName,
  //           userEmail: user.attributes.email,
  //         },
  //       });
  //     } catch (err) {
  //       console.log(err);
  //       dispatch({ type: "LOG_OUT" });
  //     }
  //   };
  //   checkAuthState();
  // }, []);

  return (
    <UserContext.Provider
      value={useMemo(() => ({ state, dispatch }), [state, dispatch])}
    >
      {children}
    </UserContext.Provider>
  );
};
