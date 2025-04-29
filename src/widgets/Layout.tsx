import React, { ReactNode } from "react";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="md:h-screen md:max-h-screen flex flex-col">
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
