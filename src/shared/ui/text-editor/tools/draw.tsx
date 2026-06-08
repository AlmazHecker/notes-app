import type { Editor } from "@tiptap/react";
import { Pencil, Trash2 } from "lucide-react";
import { type FC, useEffect, useState } from "react";

export const DrawTool: FC<{ editor: Editor }> = ({ editor }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#A975FF");
  const [weight, setWeight] = useState(editor.storage.paper?.weight ?? 2);

  useEffect(() => {
    const handleUpdate = () => {
      setIsDrawing(editor.storage.paper?.drawingActive ?? false);
      setColor(editor.storage.paper?.color ?? "#A975FF");
      setWeight(editor.storage.paper?.weight ?? 4);
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);
    handleUpdate();

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    editor.commands.setDrawOptions?.({ color: newColor });
  };

  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight);
    editor.commands.setDrawOptions?.({ weight: newWeight });
  };

  return (
    <>
      <button
        onClick={() => {
          editor.commands.toggleDrawing?.();
          setIsDrawing(!isDrawing);
        }}
        className={`toolbar-btn ${isDrawing ? "is-active" : ""}`}
        title="Toggle drawing"
      >
        <Pencil size={16} />
      </button>

      {isDrawing && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "8px",
          }}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            title="Stroke Color"
            style={{
              width: "24px",
              height: "24px",
              padding: 0,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              background: "none",
            }}
          />
          <input
            type="number"
            min="1"
            max="20"
            value={weight}
            onChange={(e) => handleWeightChange(Number(e.target.value))}
            title="Stroke Weight"
            style={{
              width: "45px",
              padding: "2px 4px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "12px",
              textAlign: "center",
            }}
          />
          <button
            onClick={() => editor.commands.clearAllPaper()}
            className="toolbar-btn"
            title="Clear all drawings"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </>
  );
};
