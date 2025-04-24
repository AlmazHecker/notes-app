import { useNoteStore } from "@/entities/note/api";
import { NoteService } from "@/entities/note/service";
import {
  getFolderHandle,
  getTotalFolderSize,
  verifyPermission,
} from "@/lib/fileApi";
import { formatSize } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import JSZip from "jszip";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type StorageSettingsProps = {
  // Define your props here
};

const StorageSettings: React.FC<StorageSettingsProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { notes, fetchNotes } = useNoteStore();
  const [folderSize, setFolderSize] = useState<number | null>(null);

  async function loadFolderSize() {
    try {
      const handle = await getFolderHandle();
      const hasPermission = await verifyPermission(handle);
      if (!hasPermission) return;

      const size = await getTotalFolderSize(handle);
      setFolderSize(size);
      fetchNotes();
    } catch (err) {
      console.error("Failed to load folder size:", err);
    }
  }

  const goToExport = () => {
    return navigate("/export");
  };

  const deleteNotes = async () => {
    if (notes.length === 0) {
      return alert("You don't have any notes");
    }
    const folderHandle = await getFolderHandle();

    try {
      if (confirm("Are you sure bruh ?")) {
        for await (let note of notes) {
          await folderHandle.removeEntry(note.id);
        }
        alert("Successfully deleted all notes!");
        await loadFolderSize();
      }
    } catch (e) {
      alert("Something went wrong!");
    }
  };

  const importNotes = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".zip";

      input.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        const zip = await JSZip.loadAsync(file);

        for await (const [filename, zipEntry] of Object.entries(zip.files)) {
          if (zipEntry.dir) continue;
          const file = await zipEntry.async("blob");
          await NoteService.import(filename, file);
        }

        alert("Notes imported successfully!");
        loadFolderSize();
      };
      input.click();
    } catch (err) {
      console.error("Failed to import notes:", err);
      alert("Error importing notes.");
    }
  };

  useEffect(() => {
    loadFolderSize();
  }, []);

  const formattedSize =
    folderSize !== null ? (
      formatSize(folderSize)
    ) : (
      <Button onClick={loadFolderSize}>
        {t("settings.storage.permissionNeeded")}
      </Button>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("settings.storage.title")}</h1>

      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">
                {t("settings.storage.used")}
              </h3>
              <p className="text-sm font-medium">{formattedSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("settings.dataManagement.title")} IN PROCESS!
          </CardTitle>
          <CardDescription>
            {t("settings.dataManagement.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <h3 className="font-medium mb-2">
              {t("settings.dataManagement.downloadTitle")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("settings.dataManagement.downloadDescription")}
            </p>
            <Button variant="outline" onClick={goToExport}>
              {t("settings.dataManagement.exportButton")}
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-yellow-900/20 border border-blue-100 dark:border-yellow-800">
            <h3 className="font-medium mb-2">
              {t("settings.dataManagement.importTitle")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("settings.dataManagement.importDescription")}
            </p>
            <Button variant="outline" onClick={importNotes}>
              {t("settings.dataManagement.importButton")}
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
            <h3 className="font-medium mb-2 text-red-600 dark:text-red-400">
              {t("settings.dataManagement.deleteTitle")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("settings.dataManagement.deleteDescription")}
            </p>
            <Button variant="destructive" onClick={deleteNotes}>
              {t("settings.dataManagement.deleteButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageSettings;
