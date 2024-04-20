import React from "react";

interface MinLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FunctionComponent<MinLayoutProps> = ({
  children,
}) => {
  return <div className="main-layout">{children}</div>;
};
