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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type StorageSettingsProps = {
  // Define your props here
};

const StorageSettings: React.FC<StorageSettingsProps> = (props) => {
  const { t } = useTranslation();
  const [folderSize, setFolderSize] = useState<number | null>(null);

  async function loadFolderSize() {
    try {
      const handle = await getFolderHandle();
      const hasPermission = await verifyPermission(handle);
      if (!hasPermission) return;

      const size = await getTotalFolderSize(handle);
      setFolderSize(size);
    } catch (err) {
      console.error("Failed to load folder size:", err);
    }
  }

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
          <CardTitle>{t("settings.dataManagement.title")}</CardTitle>
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
            <Button variant="outline">
              {t("settings.dataManagement.exportButton")}
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
            <h3 className="font-medium mb-2 text-red-600 dark:text-red-400">
              {t("settings.dataManagement.deleteTitle")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("settings.dataManagement.deleteDescription")}
            </p>
            <Button variant="destructive">
              {t("settings.dataManagement.deleteButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageSettings;
