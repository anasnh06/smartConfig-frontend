"use client"

import { useEffect, useState, useMemo } from "react"
import { useForm, FormProvider, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useStepperStore } from "@/lib/store/stepper"
import { useServersStore } from "@/lib/store/servers"
import { useTemplatesStore } from "@/lib/store/templates"
import { useConfigurationsStore } from "@/lib/store/configurations"
import type { Server } from "@/types/entities/server"
import type { Template } from "@/types/entities/template"
import type { Configuration } from "@/types/entities/configuration"

// ... Section, ServerMultiSelect, TemplateSelect, ConfigurationSelect identiques à create-stepper-group-modal.tsx ...
function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <fieldset className="border border-muted rounded-lg p-5 mb-6 bg-background shadow-sm">
      <legend className="px-2 text-base font-semibold text-primary">{title}</legend>
      {children}
    </fieldset>
  )
}

function ServerMultiSelect({ servers, value, onChange }: {
  servers: Server[],
  value: string[],
  onChange: (val: string[]) => void
}) {
  const [search, setSearch] = useState("")
  const [osFilter, setOsFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [projectFilter, setProjectFilter] = useState("")
  const [environmentFilter, setEnvironmentFilter] = useState("")

  const osOptions = useMemo(
    () => Array.from(new Set(servers.map(s => s.operating_system?.name).filter(Boolean))),
    [servers]
  )
  const roleOptions = useMemo(
    () => Array.from(new Set(servers.flatMap(s => s.roles?.map((r: { name: string }) => r.name)).filter(Boolean))),
    [servers]
  )
  const projectOptions = useMemo(
    () => Array.from(new Set(servers.map(s => s.project?.name).filter(Boolean))),
    [servers]
  )
  const environmentOptions = useMemo(
    () => Array.from(new Set(servers.map(s => s.environment?.name).filter(Boolean))),
    [servers]
  )

  const filteredServers = useMemo(() => {
    return servers.filter(server => {
      const matchSearch =
        server.name.toLowerCase().includes(search.toLowerCase()) ||
        server.ip_address.includes(search) ||
        server.operating_system?.name?.toLowerCase().includes(search.toLowerCase()) ||
        server.project?.name?.toLowerCase().includes(search.toLowerCase()) ||
        server.environment?.name?.toLowerCase().includes(search.toLowerCase())
      const matchOs = osFilter ? server.operating_system?.name === osFilter : true
      const matchRole = roleFilter
        ? server.roles?.some((r: { name: string }) => r.name === roleFilter)
        : true
      const matchProject = projectFilter ? server.project?.name === projectFilter : true
      const matchEnv = environmentFilter ? server.environment?.name === environmentFilter : true
      return matchSearch && matchOs && matchRole && matchProject && matchEnv
    })
  }, [servers, search, osFilter, roleFilter, projectFilter, environmentFilter])

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <Section title="Sélection des serveurs">
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="Recherche (nom, IP, OS, projet, env)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-56"
        />
        <select
          value={osFilter}
          onChange={e => setOsFilter(e.target.value)}
          className="border rounded p-2 text-sm min-w-[120px]"
        >
          <option value="">Tous OS</option>
          {osOptions.map(os => (
            <option key={os} value={os}>{os}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="border rounded p-2 text-sm min-w-[120px]"
        >
          <option value="">Tous rôles</option>
          {roleOptions.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <select
          value={projectFilter}
          onChange={e => setProjectFilter(e.target.value)}
          className="border rounded p-2 text-sm min-w-[120px]"
        >
          <option value="">Tous projets</option>
          {projectOptions.map(project => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
        <select
          value={environmentFilter}
          onChange={e => setEnvironmentFilter(e.target.value)}
          className="border rounded p-2 text-sm min-w-[120px]"
        >
          <option value="">Tous environnements</option>
          {environmentOptions.map(env => (
            <option key={env} value={env}>{env}</option>
          ))}
        </select>
      </div>
      <div className="max-h-64 overflow-y-auto border rounded bg-muted/40 divide-y divide-muted">
        {filteredServers.length === 0 && (
          <div className="p-4 text-muted-foreground text-sm text-center">Aucun serveur trouvé.</div>
        )}
        {filteredServers.map(server => (
          <label
            key={server.id}
            className={`flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-accent transition-colors ${value.includes(server.id.toString()) ? "bg-accent/60" : ""}`}
          >
            <input
              type="checkbox"
              checked={value.includes(server.id.toString())}
              onChange={() => toggle(server.id.toString())}
              className="accent-primary scale-125"
            />
            <div className="flex flex-col flex-1">
              <span className="font-medium text-base">{server.name}</span>
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                <span>IP: {server.ip_address}</span>
                <span>OS: <span className="font-semibold">{server.operating_system?.name}</span></span>
                {server.environment?.name && <span>Environnement: <span className="font-semibold">{server.environment.name}</span></span>}
                {server.project?.name && <span>Projet: <span className="font-semibold">{server.project.name}</span></span>}
                {server.roles?.length > 0 && (
                  <span>Rôles: [{server.roles.map((r: { name: string }) => r.name).join(", ")}]</span>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </Section>
  )
}

function TemplateSelect({ templates, value, onChange }: {
  templates: Template[],
  value: number,
  onChange: (val: number) => void
}) {
  const [search, setSearch] = useState("")
  const [osFilter, setOsFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const osOptions = useMemo(
    () => Array.from(new Set(templates.flatMap(t => t.operating_systems?.map(os => os.name)).filter(Boolean))),
    [templates]
  )
  const roleOptions = useMemo(
    () => Array.from(new Set(templates.map(t => t.role?.name).filter(Boolean))),
    [templates]
  )

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchSearch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.operating_systems?.some(os => os.name.toLowerCase().includes(search.toLowerCase())) ||
        (template.role?.name?.toLowerCase().includes(search.toLowerCase()))
      const matchOs = osFilter
        ? template.operating_systems?.some(os => os.name === osFilter)
        : true
      const matchRole = roleFilter
        ? template.role?.name === roleFilter
        : true
      return matchSearch && matchOs && matchRole
    })
  }, [templates, search, osFilter, roleFilter])

  return (
    <Section title="Sélection du template">
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="Recherche (nom, OS, rôle)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-44"
        />
        <select
          value={osFilter}
          onChange={e => setOsFilter(e.target.value)}
          className="border rounded p-2 text-sm min-w-[120px]"
        >
          <option value="">Tous OS</option>
          {osOptions.map(os => (
            <option key={os} value={os}>{os}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="border rounded p-2 text-sm min-w-[120px]"
        >
          <option value="">Tous rôles</option>
          {roleOptions.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>
      <select
        value={value ?? 0}
        onChange={e => onChange(Number(e.target.value))}
        className="border rounded p-2 text-base w-full bg-background"
      >
        <option value="">Sélectionner template</option>
        {filteredTemplates.map(template => (
          <option key={template.id} value={template.id}>
            {template.name}
            {template.operating_systems?.length > 0 && ` [${template.operating_systems.map(os => os.name).join(", ")}]`}
            {template.role?.name && ` [${template.role.name}]`}
          </option>
        ))}
      </select>
    </Section>
  )
}

function ConfigurationSelect({ configurations, value, onChange }: {
  configurations: Configuration[],
  value: number,
  onChange: (val: number) => void
}) {
  const [search, setSearch] = useState("")
  const [osFilter, setOsFilter] = useState("")

  const osOptions = useMemo(
    () => Array.from(new Set(configurations.flatMap(c => c.operating_systems?.map(os => os.name)).filter(Boolean))),
    [configurations]
  )

  const filteredConfigurations = useMemo(() => {
    return configurations.filter(config => {
      const matchSearch =
        config.name.toLowerCase().includes(search.toLowerCase()) ||
        config.operating_systems?.some(os => os.name.toLowerCase().includes(search.toLowerCase()))
      const matchOs = osFilter
        ? config.operating_systems?.some(os => os.name === osFilter)
        : true
      return matchSearch && matchOs
    })
  }, [configurations, search, osFilter])

  return (
    <Section title="Sélection de la configuration">
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="Recherche (nom, OS)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-44"
        />
        <select
          value={osFilter}
          onChange={e => setOsFilter(e.target.value)}
          className="border rounded p-2 text-sm min-w-[120px]"
        >
          <option value="">Tous OS</option>
          {osOptions.map(os => (
            <option key={os} value={os}>{os}</option>
          ))}
        </select>
      </div>
      <select
        value={value ?? 0}
        onChange={e => onChange(Number(e.target.value))}
        className="border rounded p-2 text-base w-full bg-background"
      >
        <option value="">Sélectionner configuration</option>
        {filteredConfigurations.map(config => (
          <option key={config.id} value={config.id}>
            {config.name}{" "}
            {config.operating_systems?.length > 0 && `[${config.operating_systems.map(os => os.name).join(", ")}]`}
          </option>
        ))}
      </select>
    </Section>
  )
}

// Zod schemas
const orderSchema = z.union([z.number(), z.undefined()])
const elementSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("manual"),
    name: z.string().min(1, "Nom requis"),
    command: z.string().min(1, "Commande requise"),
    description: z.string().optional(),
    order: orderSchema,
    id: z.undefined(),
  }),
  z.object({
    type: z.literal("template"),
    id: z.number().min(1, "Sélectionnez un template"),
    order: orderSchema,
    name: z.undefined(),
    command: z.undefined(),
    description: z.undefined(),
  }),
  z.object({
    type: z.literal("configuration"),
    id: z.number().min(1, "Sélectionnez une configuration"),
    order: orderSchema,
    name: z.undefined(),
    command: z.undefined(),
    description: z.undefined(),
  }),
])
const groupSchema = z.object({
  groupName: z.string().optional(),
  servers: z.array(z.string()).min(1, "Sélectionnez au moins un serveur."),
  elements: z.array(elementSchema).min(1, "Ajoutez au moins un élément."),
})
type FormData = z.infer<typeof groupSchema>

export function EditStepperGroupModal() {
  const {
    isEditExecutionGroupModalOpen,
    setIsEditExecutionGroupModalOpen,
    draftExecutionGroups,
    selectedDraftGroupIndex,
    updateDraftGroup,
    setSelectedDraftGroupIndex,
  } = useStepperStore()

  const { toast } = useToast()
  const { servers, fetchServers } = useServersStore()
  const { templates, fetchTemplates } = useTemplatesStore()
  const { configurations, fetchConfigurations } = useConfigurationsStore()

  useEffect(() => {
    if (isEditExecutionGroupModalOpen) {
      if (servers.length === 0) fetchServers()
      if (templates.length === 0) fetchTemplates()
      if (configurations.length === 0) fetchConfigurations()
    }
  }, [isEditExecutionGroupModalOpen])

  const methods = useForm<FormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      groupName: "",
      servers: [],
      elements: [],
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "elements",
  })

  // Reset avec les valeurs du groupe à éditer
  useEffect(() => {
    if (isEditExecutionGroupModalOpen && selectedDraftGroupIndex !== null) {
      const raw = draftExecutionGroups[selectedDraftGroupIndex]
      methods.reset({
        groupName: raw.groupName ?? "",
        servers: raw.servers.map((id: number) => id.toString()),
        elements: raw.elements.map((el: any) => {
          if (el.type === "manual") {
            return {
              type: "manual",
              name: el.name ?? "",
              command: el.command ?? "",
              description: el.description ?? "",
              order: el.order,
              id: undefined,
            }
          } else {
            return {
              type: el.type,
              id: el.id ?? 0,
              order: el.order,
              name: undefined,
              command: undefined,
              description: undefined,
            }
          }
        }),
      })
    }
  }, [isEditExecutionGroupModalOpen, selectedDraftGroupIndex])

  const onSubmit = (data: FormData) => {
    if (selectedDraftGroupIndex !== null) {
      const processedData = {
        groupName: data.groupName,
        servers: data.servers.map((id) => parseInt(id, 10)),
        elements: data.elements,
      }
      updateDraftGroup(selectedDraftGroupIndex, processedData)
      toast({ title: "✅ Groupe modifié avec succès" })
    }
    methods.reset()
    setIsEditExecutionGroupModalOpen(false)
    setSelectedDraftGroupIndex(null)
  }

  // Pour la gestion du champ servers dans react-hook-form
  const serversValue = methods.watch("servers")
  const setServersValue = (val: string[]) => methods.setValue("servers", val, { shouldValidate: true })

  return (
    <Dialog
      open={isEditExecutionGroupModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsEditExecutionGroupModalOpen(false)
          setSelectedDraftGroupIndex(null)
        }
      }}
    >
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">Modifier le groupe d'exécution</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <Section title="Informations du groupe">
              <Input
                placeholder="Nom du groupe (optionnel)"
                {...methods.register("groupName")}
                className="mb-2"
              />
            </Section>

            <ServerMultiSelect
              servers={servers}
              value={serversValue}
              onChange={setServersValue}
            />
            {methods.formState.errors.servers && (
              <div className="mb-4">
                <p className="text-sm text-red-500">{methods.formState.errors.servers.message}</p>
              </div>
            )}

            <Section title="Éléments à exécuter">
              {methods.formState.errors.elements && (
                <p className="text-sm text-red-500 mb-2">{methods.formState.errors.elements.message}</p>
              )}

              <div className="flex flex-col gap-6">
                {fields.map((field, index) => {
                  const type = methods.watch(`elements.${index}.type`)

                  return (
                    <div key={field.id} className="border p-5 rounded-lg space-y-3 bg-muted/40 shadow-sm">
                      <div className="flex flex-wrap gap-4 items-center">
                        <span className="text-base font-semibold capitalize">{type}</span>

                        {type === "manual" && (
                          <>
                            <Input
                              placeholder="Nom"
                              {...methods.register(`elements.${index}.name`)}
                              className="flex-1 min-w-[140px]"
                            />
                            <Input
                              placeholder="Commande"
                              {...methods.register(`elements.${index}.command`)}
                              className="flex-1 min-w-[140px]"
                            />
                            <Input
                              placeholder="Description (optionnel)"
                              {...methods.register(`elements.${index}.description`)}
                              className="flex-1 min-w-[180px]"
                            />
                          </>
                        )}

                        {type === "template" && (
                          <TemplateSelect
                            templates={templates}
                            value={methods.watch(`elements.${index}.id`) ?? 0}
                            onChange={val => methods.setValue(`elements.${index}.id`, val, { shouldValidate: true })}
                          />
                        )}

                        {type === "configuration" && (
                          <ConfigurationSelect
                            configurations={configurations}
                            value={methods.watch(`elements.${index}.id`) ?? 0}
                            onChange={val => methods.setValue(`elements.${index}.id`, val, { shouldValidate: true })}
                          />
                        )}

                        <Input
                          placeholder="Ordre (optionnel)"
                          type="number"
                          {...methods.register(`elements.${index}.order`, { valueAsNumber: true })}
                          className="w-32"
                        />

                        <Button type="button" variant="destructive" onClick={() => remove(index)}>
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3 flex-wrap pt-4 justify-end">
                <Button type="button" variant="secondary" onClick={() => append({ type: "template", id: 0 })}>
                  + Template
                </Button>
                <Button type="button" variant="secondary" onClick={() => append({ type: "configuration", id: 0 })}>
                  + Configuration
                </Button>
                <Button type="button" variant="secondary" onClick={() => append({ type: "manual", name: "", command: "" })}>
                  + Commande manuelle
                </Button>
              </div>
            </Section>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="px-8 py-2 text-lg font-semibold">Enregistrer les modifications</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
