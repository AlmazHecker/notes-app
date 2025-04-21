import {
  getFolderHandle,
  getTotalFolderSize,
  verifyPermission,
} from "@/lib/fileApi";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import React, { useEffect, useState } from "react";

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

type StorageSettingsProps = {
  // Define your props here
};

const StorageSettings: React.FC<StorageSettingsProps> = (props) => {
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
      <Button onClick={loadFolderSize}>Open Folder</Button>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Storage</h1>

      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Storage Used</h3>
              <p className="text-sm font-medium">{formattedSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Download or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <h3 className="font-medium mb-2">Download Your Data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You can download a copy of all your data that we have stored in
              our systems.
            </p>
            <Button variant="outline">Request Data Export</Button>
          </div>

          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
            <h3 className="font-medium mb-2 text-red-600 dark:text-red-400">
              Delete Your Data
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This will permanently delete your data and all associated data.
              This action cannot be undone.
            </p>
            <Button variant="destructive">Delete Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageSettings;
