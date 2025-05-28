"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Check, ChevronsUpDown } from "lucide-react"

import { environments } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  environmentIds: z.array(z.string()).min(1, {
    message: "Select at least one environment.",
  }),
})

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([])
  const [environmentsOpen, setEnvironmentsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      environmentIds: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would call an API to create the project
    console.log(values)

    toast({
      title: "Project created",
      description: `Project "${values.name}" has been created successfully.`,
    })

    onOpenChange(false)
    form.reset()
    setSelectedEnvironments([])

    // In a real app, we would navigate to the new project
    // For now, just refresh the page
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span>Create Project</span>
          </DialogTitle>
          <DialogDescription>Create a new project to organize your infrastructure resources.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E-commerce Platform" {...field} />
                  </FormControl>
                  <FormDescription>The name of your project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of the project..." {...field} />
                  </FormControl>
                  <FormDescription>A short description of what this project is for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="environmentIds"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Environments</FormLabel>
                  <Popover open={environmentsOpen} onOpenChange={setEnvironmentsOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={environmentsOpen}
                          className={cn("justify-between", !field.value.length && "text-muted-foreground")}
                        >
                          {field.value.length
                            ? `${field.value.length} environment${field.value.length > 1 ? "s" : ""} selected`
                            : "Select environments"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search environments..." />
                        <CommandList>
                          <CommandEmpty>No environments found.</CommandEmpty>
                          <CommandGroup>
                            {environments.map((environment) => (
                              <CommandItem
                                key={environment.id}
                                value={environment.id}
                                onSelect={() => {
                                  const updatedValues = field.value.includes(environment.id)
                                    ? field.value.filter((id) => id !== environment.id)
                                    : [...field.value, environment.id]

                                  form.setValue("environmentIds", updatedValues)
                                  setSelectedEnvironments(updatedValues)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value.includes(environment.id) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {environment.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {field.value.map((id) => {
                      const env = environments.find((e) => e.id === id)
                      return env ? (
                        <Badge key={id} variant="secondary" className="text-xs">
                          {env.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                  <FormDescription>The environments this project will be deployed to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
