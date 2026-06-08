import { FolderPlus, Plus, SearchIcon, Settings } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";

type SpeedDialProps = {
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  handleCreateFolder: () => void;
};

export const SpeedDial = ({
  setIsSearchModalOpen,
  handleCreateFolder,
}: SpeedDialProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: t("notes.newFolder"),
      icon: FolderPlus,
      action: handleCreateFolder,
    },
    {
      label: t("Search"),
      icon: SearchIcon,
      action: () => setIsSearchModalOpen(true),
    },
    {
      label: t("Settings"),
      icon: Settings,
      action: () => navigate("/settings"),
    },
    {
      label: t("notes.addNote"),
      icon: Plus,
      action: () => navigate("?noteId=new-note"),
    },
  ];

  return (
    <div className="fixed bottom-20 right-10 z-50 md:hidden">
      {/* Backdrop */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <backdrop> */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: <backdrop> */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-200 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* FIXED: Added pointer-events-none / pointer-events-auto dynamic classes here */}
      <ul 
        className={`absolute bottom-20 right-1 flex flex-col items-center gap-4 transition-all ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {actions.map(({ label, icon: Icon, action }, index) => (
          <li
            key={label}
            aria-label={label}
            style={{
              transitionDelay: `${(isOpen ? actions.length - 1 - index : index) * 40}ms`,
            }}
            className={`relative flex items-center justify-center cursor-pointer group/item rounded-full outline-none transition-all duration-200 ${
              isOpen
                ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                : "opacity-0 pointer-events-none translate-y-4 scale-75"
            }`}
          >
            <span className="absolute right-14 opacity-0 pointer-events-none transition-opacity bg-neutral-900 text-xs text-white px-2 py-1 rounded shadow group-hover/item:opacity-100 group-active/item:opacity-100">
              {label}
            </span>

            <Button
              onClick={() => {
                action();
                setIsOpen(false);
              }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg border border-primary-foreground/10 active:scale-95 transition-transform"
            >
              <Icon className="size-5" />
            </Button>
          </li>
        ))}
      </ul>

      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg active:scale-95 border border-primary-foreground/10 relative z-10"
      >
        <Plus
          className={`size-8 transition-transform duration-200 ${isOpen ? "rotate-45" : "rotate-0"}`}
        />
      </Button>
    </div>
  );
};