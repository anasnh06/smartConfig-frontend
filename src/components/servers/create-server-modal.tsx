"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
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

export function CreateServerModal() {
  const { isCreateServerModalOpen, closeCreateServerModal } = useStore();
  const { toast } = useToast();
  const addServer = useServersStore((state) => state.addServer);
  const { projects } = useProjectsStore();
  const { environments } = useEnvironmentsStore();
  const { roles } = useRolesStore();
  const { operatingSystems } = useOperatingSystemsStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ip_address: "",
      ssh_port: 22,
      ssh_user: "",
      ssh_private_key_path: "~/.ssh/id_rsa",
      operating_system_id: undefined,
      environment_id: undefined,
      project_id: undefined,
      role_ids: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await addServer(values);
      toast({
        title: "Server created",
        description: `${values.name} has been created successfully.`,
      });
      closeCreateServerModal();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the server.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isCreateServerModalOpen} onOpenChange={closeCreateServerModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Server</DialogTitle>
          <DialogDescription>
            Provide server details to add it to your infrastructure.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pb-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="server-01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ip_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ssh_port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSH Port</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ssh_user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSH User</FormLabel>
                  <FormControl>
                    <Input placeholder="root" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ssh_private_key_path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Key Path</FormLabel>
                  <FormControl>
                    <Textarea placeholder="~/.ssh/id_rsa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operating_system_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating System</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select OS" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {operatingSystems.map((os) => (
                        <SelectItem key={os.id} value={os.id.toString()}>
                          {os.name} {os.version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="environment_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Environment</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {environments.map((env) => (
                        <SelectItem key={env.id} value={env.id.toString()}>
                          {env.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <MultiSelect
                      selected={field.value.map(String)}
                      onChange={(vals) => field.onChange(vals.map(Number))}
                      options={roles.map((role) => ({ label: role.name, value: role.id.toString() }))}
                      placeholder="Select roles"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sticky bottom-0 bg-white pt-2">
              <Button type="button" variant="outline" onClick={closeCreateServerModal}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
