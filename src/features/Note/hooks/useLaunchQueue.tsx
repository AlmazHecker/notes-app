import { useEffect } from "react";
import { Note } from "@/entities/note/types";

export function useLaunchQueue(onNoteLaunched: (note: Note) => void) {
  useEffect(() => {
    if (!("launchQueue" in window) || !("files" in LaunchParams.prototype))
      return;

    const handleLaunch = async (launchParams: any) => {
      if (!launchParams.files.length) return;

      for (const fileHandle of launchParams.files) {
        try {
          const file = await fileHandle.getFile();
          if (!file.name.endsWith(".azych")) continue;

          const text = await file.text();
          const launchedNote: Note = JSON.parse(text);

          onNoteLaunched(launchedNote);
        } catch (err) {
          console.error("Failed to open launched file", err);
        }
      }
    };

    launchQueue.setConsumer(handleLaunch);
  }, []);
}
