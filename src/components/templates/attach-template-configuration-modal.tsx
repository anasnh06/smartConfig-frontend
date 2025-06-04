"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { useStore } from "@/lib/store";
import { getConfigurationShorts } from "@/lib/api/configuration";
import { createTemplateConfiguration } from "@/lib/api/template_configuration";

import type { ConfigurationShort } from "@/types/entities";

const formSchema = z.object({
  configuration_id: z.number(),
  order: z.number().nullable().optional(),
  comment: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  onAttached?: () => void;
};

export function AttachTemplateConfigurationModal({ onAttached }: Props) {
  const {
    isAttachConfigToTemplateModalOpen,
    closeAttachConfigToTemplateModal,
    selectedTemplate,
  } = useStore();
  const { toast } = useToast();

  const [configs, setConfigs] = useState<ConfigurationShort[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      configuration_id: undefined,
      order: null,
      comment: "",
    },
  });

  useEffect(() => {
    getConfigurationShorts().then(setConfigs);
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!selectedTemplate) return;
    setLoading(true);

    try {
      await createTemplateConfiguration({
        template_id: selectedTemplate.id,
        configuration_id: values.configuration_id,
        order: values.order,
        comment: values.comment,
      });

      toast({
        title: "✅ Attached",
        description: "Configuration attached successfully.",
      });

      closeAttachConfigToTemplateModal();
      onAttached?.();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Attachment failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isAttachConfigToTemplateModalOpen}
      onOpenChange={closeAttachConfigToTemplateModal}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Attach Configuration</DialogTitle>
          <DialogDescription>
            Link a configuration to this template with optional order and comment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="configuration_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded border px-3 py-2 text-sm"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <option value="">-- Select Configuration --</option>
                      {configs.map((config) => (
                        <option key={config.id} value={config.id}>
                          {config.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order (optional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeAttachConfigToTemplateModal}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Attaching..." : "Attach"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
