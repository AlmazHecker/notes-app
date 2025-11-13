import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { FC } from "react";

type PermissionDeniedProps = {
  permissionTrigger: () => void; // callback to trigger permission request
  containerClassName?: string;
};

export const PermissionDenied: FC<PermissionDeniedProps> = ({
  permissionTrigger,
  containerClassName = "",
}) => {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col items-start gap-4 ${containerClassName}`}>
      <p className="text-red-500">{t("fileApi.permissionDenied")}</p>
      <p>
        If this is your first time setting a folder, create an empty one and
        select it. Otherwise, choose an existing folder where your notes are
        saved
      </p>
      <Button className="" onClick={permissionTrigger}>
        {t("fileApi.selectFolder")}
      </Button>
    </div>
  );
};
