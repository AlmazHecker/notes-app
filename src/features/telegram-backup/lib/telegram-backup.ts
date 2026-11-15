import { entryService } from "@/entities/entry/service";

const STORAGE_KEY = "telegram-backup";
const emptyConfig = { token: "", chatId: "", lastSuccess: 0 };

function validCredentials(token: string, chatId: string) {
  return (
    typeof token === "string" &&
    typeof chatId === "string" &&
    /^\d+:[A-Za-z0-9_-]+$/.test(token) &&
    /^-?\d+$/.test(chatId)
  );
}

export function readTelegramConfiguration(): typeof emptyConfig {
  try {
    const config = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!config || !validCredentials(config.token, config.chatId))
      return emptyConfig;
    return {
      token: config.token,
      chatId: config.chatId,
      lastSuccess: Number.isFinite(config.lastSuccess) ? config.lastSuccess : 0,
    };
  } catch {
    return emptyConfig;
  }
}

export function saveTelegramConfiguration(draft: typeof emptyConfig) {
  const token = draft.token.trim();
  const chatId = draft.chatId.trim();
  if (!validCredentials(token, chatId)) throw new Error("credentials");
  const previous = readTelegramConfiguration();
  const config = {
    token,
    chatId,
    lastSuccess:
      previous.token === token && previous.chatId === chatId
        ? previous.lastSuccess
        : 0,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  return config;
}

export function removeTelegramConfiguration() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...emptyConfig };
}

export async function sendTelegramBackup() {
  const config = readTelegramConfiguration();
  if (!config.token || !config.chatId) return null;

  try {
    const archive = await entryService.exportFull();
    if (archive.size > 50 * 1024 * 1024) return "tooLarge" as const;
    const body = new FormData();
    body.append("chat_id", config.chatId);
    body.append(
      "document",
      archive,
      `notes_backup_${new Date().toISOString().split("T")[0]}.zip`,
    );
    const response = await fetch(
      `https://api.telegram.org/bot${config.token}/sendDocument`,
      {
        method: "POST",
        body,
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(120_000),
      },
    );
    const result = await response.json();
    if (!response.ok || result.ok !== true) return "failed" as const;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...config, lastSuccess: Date.now() }),
    );
    return "sent" as const;
  } catch {
    return "failed" as const;
  } 
}
