import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MinLayout: React.FunctionComponent<MainLayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};
