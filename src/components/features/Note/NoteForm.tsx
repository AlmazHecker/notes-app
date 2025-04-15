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
import { getFolderHandle } from "@/lib/fileApi";

export function NoteForm() {
  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      label: "",
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof noteSchema>) => {
    const folderHandle = await getFolderHandle();

    const fileHandle = await folderHandle.getFileHandle(`${data.label}.txt`, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(data.content);
    await writable.close();

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 min-w-4/5"
      >
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
                <Input placeholder="Content" {...field} />
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
