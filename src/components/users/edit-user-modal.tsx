"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useUsersStore } from "@/lib/store/users"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")), // ← accepte aussi une chaîne vide
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

type EditUserModalProps = {
  onUpdated?: () => void
}

export function EditUserModal({ onUpdated }: EditUserModalProps) {
  const { isEditUserModalOpen, closeEditUserModal, selectedUser } = useStore()
  const updateUser = useUsersStore((state) => state.updateUser)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      is_active: true,
    },
  })

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        username: selectedUser.username,
        email: selectedUser.email,
        is_active: selectedUser.is_active ?? true,
        // 🔥 Pas de `password` ici
      })
    }
  }, [selectedUser, form])

  const onSubmit = async (values: FormValues) => {
    if (!selectedUser) return
    setIsLoading(true)

    try {
      const dataToSend = { ...values }
      if (!dataToSend.password) delete dataToSend.password

      await updateUser(selectedUser.id, dataToSend)

      toast({
        title: "User updated",
        description: `${values.username} has been updated successfully.`,
      })

      closeEditUserModal()
      form.reset()
      onUpdated?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isEditUserModalOpen} onOpenChange={closeEditUserModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <DialogDescription>Is this user active?</DialogDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditUserModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
