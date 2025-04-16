"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { noteSchema } from "@/lib/notesDB";
import { doesFileExist, getFolderHandle } from "@/lib/fileApi";
import { Link } from "@/components/ui/link";
import { TextEditor } from "@/components/ui/text-editor/text-editor";
import { useRef } from "react";
import { type Editor } from "@tiptap/react";

export function NoteForm() {
  const editorRef = useRef<Editor | null>(null);

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      label: "",
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof noteSchema>) => {
    const folderHandle = await getFolderHandle();
    const exists = await doesFileExist(folderHandle, `${data.label}.txt`);
    if (exists) {
      form.setError("label", {
        type: "manual",
        message: "A note with this label already exists!",
      });
      return;
    }

    const fileHandle = await folderHandle.getFileHandle(`${data.label}.txt`, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(editorRef.current?.getHTML() as string);
    await writable.close();

    form.reset();
    editorRef.current?.commands.clearContent();
  };

  console.log(form.getValues());
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-[800px] w-full"
      >
        <Link href="/notes" variant="outline">
          Go Back
        </Link>

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Label</FormLabel>
              <FormControl>
                <Input placeholder="Label" {...field} />
              </FormControl>
              <FormDescription>Give it a name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Content</FormLabel>
              <FormControl>
                <TextEditor
                  className="bg-input/30 rounded-md"
                  {...field}
                  ref={editorRef}
                />
              </FormControl>
              <FormDescription>Write something chill.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Note</Button>
      </form>
    </Form>
  );
}
