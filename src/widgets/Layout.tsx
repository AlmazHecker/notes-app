import React, { ReactNode } from "react";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="max-h-screen h-full flex flex-col">
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
