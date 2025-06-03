"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

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
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/lib/store";
import { useServersStore } from "@/lib/store/servers";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/shared/multi-select";
import { useProjectsStore } from "@/lib/store/projects";
import { useEnvironmentsStore } from "@/lib/store/environments";
import { useRolesStore } from "@/lib/store/roles";
import { useOperatingSystemsStore } from "@/lib/store/operating-systems";
import type { Server } from "@/types/entities";

const formSchema = z.object({
  name: z.string().min(2),
  ip_address: z.string().min(7),
  ssh_port: z.coerce.number().int().positive(),
  ssh_user: z.string().min(2),
  ssh_private_key_path: z.string().min(2),
  operating_system_id: z.coerce.number(),
  environment_id: z.coerce.number(),
  project_id: z.coerce.number(),
  role_ids: z.array(z.coerce.number()),
});

type FormValues = z.infer<typeof formSchema>;

export function EditServerModal({ onUpdated }: { onUpdated?: () => void }) {
  const { isEditServerModalOpen, closeEditServerModal, selectedServer } = useStore();
  const { toast } = useToast();
  const updateServer = useServersStore((state) => state.updateServer);
  const { projects } = useProjectsStore();
  const { environments } = useEnvironmentsStore();
  const { roles } = useRolesStore();
  const { operatingSystems } = useOperatingSystemsStore();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ip_address: "",
      ssh_port: 22,
      ssh_user: "",
      ssh_private_key_path: "",
      operating_system_id: undefined,
      environment_id: undefined,
      project_id: undefined,
      role_ids: [],
    },
  });

  useEffect(() => {
    if (!selectedServer) return;
    form.reset({
      name: selectedServer.name,
      ip_address: selectedServer.ip_address,
      ssh_port: selectedServer.ssh_port,
      ssh_user: selectedServer.ssh_user,
      ssh_private_key_path: selectedServer.ssh_private_key_path,
      operating_system_id: selectedServer.operating_system.id,
      environment_id: selectedServer.environment.id,
      project_id: selectedServer.project.id,
      role_ids: selectedServer.roles.map((r) => r.id),
    });
  }, [selectedServer?.id]);

  const onSubmit = async (values: FormValues) => {
    if (!selectedServer) return;

    const payload: Partial<FormValues> = {};

    if (values.name !== selectedServer.name) payload.name = values.name;
    if (values.ip_address !== selectedServer.ip_address) payload.ip_address = values.ip_address;
    if (values.ssh_port !== selectedServer.ssh_port) payload.ssh_port = values.ssh_port;
    if (values.ssh_user !== selectedServer.ssh_user) payload.ssh_user = values.ssh_user;
    if (values.ssh_private_key_path !== selectedServer.ssh_private_key_path) payload.ssh_private_key_path = values.ssh_private_key_path;
    if (values.operating_system_id !== selectedServer.operating_system.id) payload.operating_system_id = values.operating_system_id;
    if (values.environment_id !== selectedServer.environment.id) payload.environment_id = values.environment_id;
    if (values.project_id !== selectedServer.project.id) payload.project_id = values.project_id;

    const originalRoleIds = selectedServer.roles.map(r => r.id).sort();
    const newRoleIds = [...values.role_ids].sort();
    if (JSON.stringify(originalRoleIds) !== JSON.stringify(newRoleIds)) {
      payload.role_ids = values.role_ids;
    }

    try {
      await updateServer(selectedServer.id, payload);
      queryClient.invalidateQueries({ queryKey: ["server", selectedServer.id] });
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      toast({
        title: "Server updated",
        description: `${values.name} has been updated.`,
      });
      closeEditServerModal();
      onUpdated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update server.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isEditServerModalOpen} onOpenChange={closeEditServerModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Server</DialogTitle>
          <DialogDescription>Update the server configuration.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="ip_address" render={({ field }) => (
              <FormItem>
                <FormLabel>IP Address</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="ssh_port" render={({ field }) => (
              <FormItem>
                <FormLabel>SSH Port</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="ssh_user" render={({ field }) => (
              <FormItem>
                <FormLabel>SSH User</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="ssh_private_key_path" render={({ field }) => (
              <FormItem>
                <FormLabel>Private Key Path</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="operating_system_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Operating System</FormLabel>
                <Select onValueChange={(val) => field.onChange(Number(val))} value={typeof field.value === "number" ? field.value.toString() : undefined}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select OS" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {operatingSystems.map((os) => (
                      <SelectItem key={os.id} value={os.id.toString()}>{os.name} {os.version}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="environment_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Environment</FormLabel>
                <Select onValueChange={(val) => field.onChange(Number(val))} value={typeof field.value === "number" ? field.value.toString() : undefined}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select environment" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {environments.map((env) => (
                      <SelectItem key={env.id} value={env.id.toString()}>{env.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="project_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select onValueChange={(val) => field.onChange(Number(val))} value={typeof field.value === "number" ? field.value.toString() : undefined}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role_ids" render={({ field }) => (
              <FormItem>
                <FormLabel>Roles</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value.map(String)}
                    onChange={(vals) => field.onChange(vals.map(Number))}
                    options={roles.map((role) => ({ label: role.name, value: role.id.toString() }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter className="sticky bottom-0 bg-white pt-2">
              <Button type="button" variant="outline" onClick={closeEditServerModal}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
