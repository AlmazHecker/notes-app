import { BaseEntry } from "../entry/types";

export type FolderEntry = BaseEntry & {
  type: "folder";
};
