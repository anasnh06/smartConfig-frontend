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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

import { useStore } from "@/lib/store";
import { updateTemplate } from "@/lib/api/template";
import { bulkAttachConfigurations } from "@/lib/api/template_configuration";
import { getOperatingSystemShorts } from "@/lib/api/operating-system";
import { getRoleShorts } from "@/lib/api/role";
import { getConfigurationShorts } from "@/lib/api/configuration";

import type { OperatingSystemShort, RoleShort, ConfigurationShort } from "@/types/entities";

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  role_id: z.number(),
  operating_system_ids: z.array(z.number()).min(1),
  configurations: z
    .array(
      z.object({
        configuration_id: z.number(),
        order: z.number().nullable(),
        comment: z.string().nullable(),
      })
    )
    .min(1),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  onUpdated?: () => void;
};

export function EditTemplateModal({ onUpdated }: Props) {
  const { isEditTemplateModalOpen, closeEditTemplateModal, selectedTemplate } = useStore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<RoleShort[]>([]);
  const [oses, setOses] = useState<OperatingSystemShort[]>([]);
  const [configs, setConfigs] = useState<ConfigurationShort[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      role_id: undefined as any,
      operating_system_ids: [],
      configurations: [],
    },
  });

  useEffect(() => {
    getRoleShorts().then(setRoles);
    getOperatingSystemShorts().then(setOses);
    getConfigurationShorts().then(setConfigs);
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      form.reset({
        name: selectedTemplate.name,
        description: selectedTemplate.description ?? "",
        role_id: selectedTemplate.role?.id ?? undefined,
        operating_system_ids: selectedTemplate.operating_systems.map((os) => os.id),
        configurations: selectedTemplate.template_configurations.map((tc) => ({
          configuration_id: tc.configuration.id,
          order: tc.order,
          comment: tc.comment ?? undefined, // ← ICI la correction
        })),
      });

    }
  }, [selectedTemplate, form]);

  const toggleConfig = (id: number) => {
    const existing = form.getValues("configurations");
    const found = existing.find((c) => c.configuration_id === id);
    if (found) {
      form.setValue(
        "configurations",
        existing.filter((c) => c.configuration_id !== id)
      );
    } else {
      form.setValue("configurations", [...existing, { configuration_id: id, order: null, comment: null }]);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedTemplate) return;
    setIsLoading(true);
    try {
      await updateTemplate(selectedTemplate.id, {
        name: values.name,
        description: values.description,
        role_id: values.role_id,
        operating_system_ids: values.operating_system_ids,
      });

      await bulkAttachConfigurations({
        template_id: selectedTemplate.id,
        configurations: values.configurations,
      });

      toast({ title: "✅ Template updated", description: `\"${values.name}\" has been updated.` });
      onUpdated?.();
      closeEditTemplateModal();
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message || "Failed to update template" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isEditTemplateModalOpen} onOpenChange={closeEditTemplateModal}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>Update template info and configurations.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="role_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <select
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full rounded border px-3 py-2 text-sm"
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )} />

            <Tabs defaultValue="os" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="os">Operating Systems</TabsTrigger>
                <TabsTrigger value="configs">Configurations</TabsTrigger>
              </TabsList>

              <TabsContent value="os" className="border rounded-md p-4 mt-2">
                <FormField
                  control={form.control}
                  name="operating_system_ids"
                  render={() => (
                    <FormItem>
                      <FormLabel>Compatible OS</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {oses.map((os) => (
                          <FormField
                            key={os.id}
                            control={form.control}
                            name="operating_system_ids"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value.includes(os.id)}
                                    onCheckedChange={(checked) =>
                                      checked
                                        ? field.onChange([...field.value, os.id])
                                        : field.onChange(field.value.filter((v) => v !== os.id))
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{os.name} {os.version}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="configs" className="border rounded-md p-4 mt-2">
                <FormField
                  control={form.control}
                  name="configurations"
                  render={() => (
                    <FormItem>
                      <FormLabel>Configurations</FormLabel>
                      <div className="space-y-2">
                        {configs.map((config) => {
                          const selected = form.watch("configurations").find((c) => c.configuration_id === config.id);
                          return (
                            <div key={config.id} className="flex flex-col border rounded p-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={!!selected}
                                  onCheckedChange={() => toggleConfig(config.id)}
                                />
                                <span>{config.name}</span>
                              </div>
                              {selected && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <Input
                                    type="number"
                                    placeholder="Order (optional)"
                                    value={selected.order ?? ""}
                                    onChange={(e) => {
                                      const updated = form.getValues("configurations").map((c) =>
                                        c.configuration_id === config.id ? { ...c, order: Number(e.target.value) || null } : c
                                      );
                                      form.setValue("configurations", updated);
                                    }}
                                  />
                                  <Input
                                    placeholder="Comment (optional)"
                                    value={selected.comment ?? ""}
                                    onChange={(e) => {
                                      const updated = form.getValues("configurations").map((c) =>
                                        c.configuration_id === config.id ? { ...c, comment: e.target.value || null } : c
                                      );
                                      form.setValue("configurations", updated);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditTemplateModal}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
