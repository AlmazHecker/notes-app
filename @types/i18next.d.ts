import kgJSON from "@/shared/locale/resources/kg.json";
import ruJSON from "@/shared/locale/resources/ru.json";
import enJSON from "@/shared/locale/resources/en.json";

import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      ru: typeof ruJSON;
      kg: typeof kgJSON;
      en: typeof enJSON;
    };
    defaultNS: "ru";
  }
}
