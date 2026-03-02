import kgJSON from "./resources/kg.json";
import ruJSON from "./resources/ru.json";
import enJSON from "./resources/en.json";

import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      ru: typeof ruJSON;
      kg: typeof kgJSON;
      en: typeof enJSON;
    };
    defaultNS: "en";
  }
}
