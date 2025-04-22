import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { useUserPreferences } from "@/shared/hooks/useUserPreferences";
import { useTranslation } from "react-i18next";
import { isCyrillic } from "@/lib/utils";

type RegionalSettingsProps = {};

const RegionalSettings: React.FC<RegionalSettingsProps> = () => {
  const { t } = useTranslation();
  const { language, dateFormat, setLanguage, setDateFormat } =
    useUserPreferences();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("settings.language.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.language.languageSettings")}</CardTitle>
          <CardDescription>
            {t("settings.language.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language">
              {t("settings.language.displayLanguage")}
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                id="language"
                className={isCyrillic(language) ? "font-sans" : ""}
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru" className="font-sans">
                  Русский
                </SelectItem>
                <SelectItem value="kg" className="font-sans">
                  Кыргызча
                </SelectItem>
                <SelectItem value="jp">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">
              {t("settings.language.dateFormat")}
            </Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY/MM/DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionalSettings;
