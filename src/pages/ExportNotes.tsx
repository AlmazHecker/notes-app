import React, { useState, useEffect } from "react";
import { getFolderHandle } from "@/shared/lib/fileApi";
import { Download, ArrowLeft, Folder } from "lucide-react";
import JSZip from "jszip";
import { useNoteStore } from "@/entities/note/api";

import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { formatDate, getEscapedHtml } from "@/shared/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ExportNotes: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const notesStore = useNoteStore();
  const [selectedNotes, setSelectedNotes] = useState<Record<string, boolean>>(
    {}
  );

  const [isExporting, setIsExporting] = useState(false);

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  const toggleAllNotes = () => {
    const allSelected = notesStore.notes.every(
      (note) => selectedNotes[note.id]
    );
    const newSelection: Record<string, boolean> = {};

    notesStore.notes.forEach((note) => {
      newSelection[note.id] = !allSelected;
    });

    setSelectedNotes(newSelection);
  };

  const getSelectedCount = () => {
    return notesStore.notes.filter((note) => selectedNotes[note.id]).length;
  };

  const getNotes = async () => {
    try {
      await notesStore.verifyPermission();
      const notes = await notesStore.fetchNotes();

      const initialSelection: Record<string, boolean> = {};
      notes.forEach((note) => {
        initialSelection[note.id] = true;
      });
      setSelectedNotes(initialSelection);
    } catch (err) {
      console.error("Failed to load folder:", err);
    }
  };

  const exportNotes = async () => {
    try {
      setIsExporting(true);

      const notesToExport = notesStore.notes.filter(
        (note) => selectedNotes[note.id]
      );
      if (notesToExport.length === 0) {
        setIsExporting(false);
        return;
      }

      const zip = new JSZip();
      const folderHandle = await getFolderHandle();

      for (const note of notesToExport) {
        const fileHandle = await folderHandle.getFileHandle(note.id);
        const file = await fileHandle.getFile();

        if (!file) continue;

        zip.file(note.id, file);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const fileName = `notes_export_${timestamp}.zip`;

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBack = () => {
    return navigate("/settings");
  };

  useEffect(() => {
    getNotes();
  }, []);

  const renderNotes = () => {
    if (!notesStore.hasPermission) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <p className="text-slate-500 text-center">
            {t("exportNotes.permissionDenied")}
          </p>
        </div>
      );
    }
    return notesStore.notes.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <p className="text-slate-500 text-center">{t("exportNotes.noNotes")}</p>
      </div>
    ) : (
      <div className="h-[calc(100vh-11rem)]">
        <div className="flex items-center gap-3 mb-3">
          <Checkbox
            id="toggle-select"
            checked={notesStore.notes.every((note) => selectedNotes[note.id])}
            onCheckedChange={toggleAllNotes}
          />
          <label className="text-sm font-medium" htmlFor="toggle-select">
            {notesStore.notes.every((note) => selectedNotes[note.id])
              ? t("exportNotes.deselectAll")
              : t("exportNotes.selectAll")}
          </label>
        </div>

        <div className="space-y-2 mb-20">
          {notesStore.notes.map((note) => (
            <div
              key={note.id}
              className="bg-card p-5 rounded-md cursor-pointer transition-colors flex flex-col w-full"
              onClick={() => toggleNoteSelection(note.id)}
            >
              <div className="flex justify-between items-center gap-3">
                <Checkbox
                  checked={selectedNotes[note.id]}
                  onCheckedChange={() => toggleNoteSelection(note.id)}
                />
                <span className="font-medium mr-auto">{note.label}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(note.updatedAt)}
                </span>
              </div>
              {note.isEncrypted || (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {getEscapedHtml(note.content)}
                  {note.content.length > 100 ? "..." : ""}
                </p>
              )}
              {note.isEncrypted && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {t("exportNotes.encrypted")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">{t("exportNotes.title")}</h1>
        </div>
        <div className="flex items-center gap-2">
          {notesStore.hasPermission || (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={getNotes}
                className="hidden sm:flex items-center"
              >
                <Folder className="mr-2 h-4 w-4" />
                <span>{t("exportNotes.buttons.openFolder")}</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={getNotes}
                className="sm:hidden"
              >
                <Folder className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={exportNotes}
            disabled={isExporting || getSelectedCount() === 0}
            className="hidden sm:flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            <span>{t("exportNotes.buttons.export")}</span>
          </Button>
          <Button
            size="icon"
            onClick={exportNotes}
            disabled={isExporting || getSelectedCount() === 0}
            className="sm:hidden"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 overflow-hidden">{renderNotes()}</div>
    </div>
  );
};

export default ExportNotes;
