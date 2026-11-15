import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  readTelegramConfiguration,
  removeTelegramConfiguration,
  saveTelegramConfiguration,
  sendTelegramBackup,
} from "../lib/telegram-backup";

export function TelegramBackupSettings() {
  const { t } = useTranslation();
  const [config, setConfig] = useState(readTelegramConfiguration);
  const [draft, setDraft] = useState(config);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<
    "credentials" | "storage" | "tooLarge" | "failed" | null
  >(null);
  const [notice, setNotice] = useState<"saved" | "sent" | "removed" | null>(
    null,
  );
  const dirty =
    draft.token.trim() !== config.token ||
    draft.chatId.trim() !== config.chatId;

  async function sendBackup() {
    setSending(true);
    setError(null);
    setNotice(null);
    const result = await sendTelegramBackup();
    setConfig(readTelegramConfiguration());
    if (result === "sent") setNotice("sent");
    else setError(result);
    setSending(false);
  }

  function save() {
    setNotice(null);
    setError(null);
    try {
      const saved = saveTelegramConfiguration(draft);
      setConfig(saved);
      setDraft(saved);
      setNotice("saved");
    } catch (error) {
      setError(
        error instanceof Error && error.message === "credentials"
          ? "credentials"
          : "storage",
      );
    }
  }

  function remove() {
    setNotice(null);
    setError(null);
    try {
      const empty = removeTelegramConfiguration();
      setConfig(empty);
      setDraft(empty);
      setNotice("removed");
    } catch {
      setError("storage");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.telegram.title")}</CardTitle>
        <CardDescription>{t("settings.telegram.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <a
            className="underline"
            href="https://t.me/BotFather"
            target="_blank"
            rel="noreferrer"
          >
            @BotFather
          </a>
          {" - "}
          {t("settings.telegram.setup")}
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <fieldset
            disabled={sending}
            className="space-y-4 disabled:opacity-60"
          >
            <div className="space-y-2">
              <Label htmlFor="telegram-token">
                {t("settings.telegram.token")}
              </Label>
              <Input
                id="telegram-token"
                type="password"
                autoComplete="off"
                spellCheck={false}
                required
                value={draft.token}
                onChange={(event) =>
                  setDraft({ ...draft, token: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram-chat">
                {t("settings.telegram.chatId")}
              </Label>
              <Input
                id="telegram-chat"
                autoComplete="off"
                required
                pattern="-?[0-9]+"
                value={draft.chatId}
                onChange={(event) =>
                  setDraft({ ...draft, chatId: event.target.value })
                }
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">{t("common.save")}</Button>
              <Button
                type="button"
                variant="outline"
                disabled={dirty || !config.token}
                onClick={() => void sendBackup()}
              >
                {sending
                  ? t("settings.telegram.sending")
                  : t("settings.telegram.send")}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!config.token}
                onClick={remove}
              >
                {t("settings.telegram.remove")}
              </Button>
            </div>
          </fieldset>
        </form>
        <div className="text-sm" aria-live="polite">
          <p>
            {t("settings.telegram.lastBackup")}:{" "}
            {config.lastSuccess
              ? new Date(config.lastSuccess).toLocaleString()
              : t("settings.telegram.never")}
          </p>
          {notice && <p>{t(`settings.telegram.notices.${notice}`)}</p>}
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {t(`settings.telegram.errors.${error}`)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
