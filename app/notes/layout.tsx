import { FC } from "react";
import { NoteList } from "@/components/features/Note/NoteList";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="dark grid grid-cols-2 divide-x h-screen shadow">
      <NoteList />
      {children}
    </div>
  );
};

export default Layout;
