import { Button } from "@/shared/ui/button";

import { Expand, Minimize2 } from "lucide-react";
import React, { useState } from "react";

const ExpandPane: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleButtonClick = () => {
    const leftPane = document.getElementById("noteList");
    const rightPane = document.getElementById("currentNote");
    const divider = document.getElementById("divider");

    if (!leftPane || !rightPane || !divider) return;

    if (!isExpanded) {
      leftPane.style.width = "0";
      leftPane.style.minWidth = "0";
      leftPane.style.opacity = "0";
      leftPane.style.overflow = "hidden";
      leftPane.classList.toggle("p-4");

      divider.style.opacity = "0";

      rightPane.style.flexGrow = "1";
      setIsExpanded(true);
    } else {
      leftPane.style.width = "50%";
      leftPane.style.minWidth = "500px";
      leftPane.style.opacity = "1";
      leftPane.style.overflow = "auto";
      leftPane.classList.toggle("p-4");

      divider.style.opacity = "1";

      rightPane.style.flexGrow = "";
      setIsExpanded(false);
    }
  };

  return (
    <Button
      onClick={handleButtonClick}
      className="md:flex hidden fixed bottom-5 right-5 z-10"
      variant="secondary"
      size="icon"
      title={isExpanded ? "Collapse" : "Expand"}
    >
      {isExpanded ? <Minimize2 size={20} /> : <Expand size={20} />}
    </Button>
  );
};

export default ExpandPane;
