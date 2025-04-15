import { z } from "zod";

export const noteSchema = z.object({
  label: z.string().min(2, { message: "Label too short." }),
  content: z.string().min(5, { message: "Content too short." }),
});

export type Note = { id?: number } & z.infer<typeof noteSchema>;
export type EncryptedNote = { id?: number; value: string };
