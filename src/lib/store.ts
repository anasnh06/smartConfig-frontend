import { create } from "zustand"
import type {
  User,
  Server,
  Configuration,
  Template,
  Role,
  Environment,
  OperatingSystem,
  Project,
  Execution,
  TemplateConfiguration,
  ExecutionGroup, 
  ServerConfiguration,
  ServerTemplate,
} from "@/types/entities"

interface ModalState {
  // États des modales par entité
  isCreateUserModalOpen: boolean
  isEditUserModalOpen: boolean
  isDeleteUserModalOpen: boolean

  isCreateServerModalOpen: boolean
  isEditServerModalOpen: boolean
  isDeleteServerModalOpen: boolean

  isCreateConfigurationModalOpen: boolean
  isEditConfigurationModalOpen: boolean
  isDeleteConfigurationModalOpen: boolean

  isCreateTemplateModalOpen: boolean
  isEditTemplateModalOpen: boolean
  isDeleteTemplateModalOpen: boolean

  isAttachConfigToTemplateModalOpen: boolean
  isEditTemplateConfigurationModalOpen: boolean
  isDeleteTemplateConfigurationModalOpen: boolean

  isCreateRoleModalOpen: boolean
  isEditRoleModalOpen: boolean
  isDeleteRoleModalOpen: boolean

  isCreateEnvironmentModalOpen: boolean
  isEditEnvironmentModalOpen: boolean
  isDeleteEnvironmentModalOpen: boolean

  isCreateOsModalOpen: boolean
  isEditOsModalOpen: boolean
  isDeleteOsModalOpen: boolean

  isCreateProjectModalOpen: boolean
  isEditProjectModalOpen: boolean
  isDeleteProjectModalOpen: boolean

  // EXECUTION CRUD
  isCreateExecutionModalOpen: boolean
  isEditExecutionModalOpen: boolean
  isDeleteExecutionModalOpen: boolean

  // EXECUTION GROUP CRUD
  isCreateExecutionGroupModalOpen: boolean
  isEditExecutionGroupModalOpen: boolean
  isDeleteExecutionGroupModalOpen: boolean

  // SERVER CONFIGURATION CRUD
  isCreateServerConfigurationModalOpen: boolean
  isEditServerConfigurationModalOpen: boolean
  isDeleteServerConfigurationModalOpen: boolean

  // SERVER TEMPLATE CRUD
  isCreateServerTemplateModalOpen: boolean
  isEditServerTemplateModalOpen: boolean
  isDeleteServerTemplateModalOpen: boolean

  isRunConfigurationModalOpen: boolean
  isRunTemplateModalOpen: boolean
  isRunExecutionModalOpen: boolean
  isReplayExecutionModalOpen: boolean
  isReplayGroupModalOpen: boolean
  isReplayServerTemplateModalOpen: boolean
  isReplayServerConfigurationModalOpen: boolean

  // ==== AJOUTÉ POUR LE STEPPER ====
  draftExecutionGroups: ExecutionGroupDraft[]
  isStepperExecutionModalOpen: boolean
  selectedDraftGroupIndex: number | null


  // États de sélection
  selectedUser: User | null
  selectedServer: Server | null
  selectedConfiguration: Configuration | null
  selectedTemplate: Template | null
  selectedTemplateConfiguration: TemplateConfiguration | null
  selectedRole: Role | null
  selectedEnvironment: Environment | null
  selectedOs: OperatingSystem | null
  selectedProject: Project | null
  selectedExecution: Partial<Execution> | null
  selectedExecutionGroup: ExecutionGroup | null
  selectedServerConfiguration: ServerConfiguration | null
  selectedServerTemplate: ServerTemplate | null
}

export interface ExecutionElement {
  type: "template" | "configuration" | "manual"
  id?: number
  command?: string
  name?: string
  description?: string
  order?: number
}

export interface ExecutionGroupDraft {
  servers: number[]
  elements: ExecutionElement[]
  comment?: string
}

interface ModalActions {
  openCreateUserModal: () => void
  closeCreateUserModal: () => void
  openEditUserModal: (user: User) => void
  closeEditUserModal: () => void
  openDeleteUserModal: (user: User) => void
  closeDeleteUserModal: () => void

  openCreateServerModal: () => void
  closeCreateServerModal: () => void
  openEditServerModal: (server: Server) => void
  closeEditServerModal: () => void
  openDeleteServerModal: (server: Server) => void
  closeDeleteServerModal: () => void

  openCreateConfigurationModal: () => void
  closeCreateConfigurationModal: () => void
  openEditConfigurationModal: (configuration: Configuration) => void
  closeEditConfigurationModal: () => void
  openDeleteConfigurationModal: (configuration: Configuration) => void
  closeDeleteConfigurationModal: () => void

  openCreateTemplateModal: () => void
  closeCreateTemplateModal: () => void
  openEditTemplateModal: (template: Template) => void
  closeEditTemplateModal: () => void
  openDeleteTemplateModal: (template: Template) => void
  closeDeleteTemplateModal: () => void

  openAttachConfigToTemplateModal: (template: Template) => void
  closeAttachConfigToTemplateModal: () => void
  openEditTemplateConfigurationModal: (tc: TemplateConfiguration) => void
  closeEditTemplateConfigurationModal: () => void
  openDeleteTemplateConfigurationModal: (tc: TemplateConfiguration) => void
  closeDeleteTemplateConfigurationModal: () => void


  openCreateRoleModal: () => void
  closeCreateRoleModal: () => void
  openEditRoleModal: (role: Role) => void
  closeEditRoleModal: () => void
  openDeleteRoleModal: (role: Role) => void
  closeDeleteRoleModal: () => void

  openCreateEnvironmentModal: () => void
  closeCreateEnvironmentModal: () => void
  openEditEnvironmentModal: (environment: Environment) => void
  closeEditEnvironmentModal: () => void
  openDeleteEnvironmentModal: (environment: Environment) => void
  closeDeleteEnvironmentModal: () => void

  openCreateOsModal: () => void
  closeCreateOsModal: () => void
  openEditOsModal: (os: OperatingSystem) => void
  closeEditOsModal: () => void
  openDeleteOsModal: (os: OperatingSystem) => void
  closeDeleteOsModal: () => void

  openCreateProjectModal: () => void
  closeCreateProjectModal: () => void
  openEditProjectModal: (project: Project) => void
  closeEditProjectModal: () => void
  openDeleteProjectModal: (project: Project) => void
  closeDeleteProjectModal: () => void

  // EXECUTION CRUD
  openCreateExecutionModal: () => void
  closeCreateExecutionModal: () => void
  openEditExecutionModal: (execution: Execution) => void
  closeEditExecutionModal: () => void
  openDeleteExecutionModal: (execution: Execution) => void
  closeDeleteExecutionModal: () => void
  setSelectedExecution: (execution: Partial<Execution> | null) => void


  // EXECUTION GROUP CRUD
  openCreateExecutionGroupModal: () => void
  closeCreateExecutionGroupModal: () => void
  openEditExecutionGroupModal: (group: ExecutionGroup) => void
  closeEditExecutionGroupModal: () => void
  openDeleteExecutionGroupModal: (group: ExecutionGroup) => void
  closeDeleteExecutionGroupModal: () => void
  setSelectedExecutionGroup: (group: ExecutionGroup | null) => void

  // SERVER CONFIGURATION CRUD
  openCreateServerConfigurationModal: () => void
  closeCreateServerConfigurationModal: () => void
  openEditServerConfigurationModal: (sc: ServerConfiguration) => void
  closeEditServerConfigurationModal: () => void
  openDeleteServerConfigurationModal: (sc: ServerConfiguration) => void
  closeDeleteServerConfigurationModal: () => void

  // SERVER TEMPLATE CRUD
  openCreateServerTemplateModal: () => void
  closeCreateServerTemplateModal: () => void
  openEditServerTemplateModal: (st: ServerTemplate) => void
  closeEditServerTemplateModal: () => void
  openDeleteServerTemplateModal: (st: ServerTemplate) => void
  closeDeleteServerTemplateModal: () => void


  openRunConfigurationModal: (configuration: Configuration) => void
  closeRunConfigurationModal: () => void
  openRunTemplateModal: (template: Template) => void
  closeRunTemplateModal: () => void

  openRunExecutionModal: () => void
  closeRunExecutionModal: () => void

  openReplayExecutionModal: (execution: Execution) => void
  closeReplayExecutionModal: () => void

  openReplayGroupModal: (group: ExecutionGroup) => void
  closeReplayGroupModal: () => void

  openReplayServerTemplateModal: (serverTemplate: ServerTemplate) => void
  closeReplayServerTemplateModal: () => void

  openReplayServerConfigurationModal: (serverConfiguration: ServerConfiguration) => void
  closeReplayServerConfigurationModal: () => void

  // ==== AJOUTÉ POUR LE STEPPER ====
  openStepperExecutionModal: () => void
  closeStepperExecutionModal: () => void
  addDraftGroup: (group: ExecutionGroupDraft) => void
  openEditDraftExecutionGroupModal: (index: number) => void;
  removeDraftGroup: (index: number) => void
  clearDraftGroups: () => void
  setSelectedDraftGroupIndex: (index: number | null) => void
  
}



type Store = ModalState & ModalActions

export const useStore = create<Store>((set) => ({
  // ==== ROLE ====
  isCreateRoleModalOpen: false,
  isEditRoleModalOpen: false,
  isDeleteRoleModalOpen: false,
  selectedRole: null,
  openCreateRoleModal: () => set({ isCreateRoleModalOpen: true }),
  closeCreateRoleModal: () => set({ isCreateRoleModalOpen: false }),
  openEditRoleModal: (role) => set({ isEditRoleModalOpen: true, selectedRole: role }),
  closeEditRoleModal: () => set({ isEditRoleModalOpen: false, selectedRole: null }),
  openDeleteRoleModal: (role) => set({ isDeleteRoleModalOpen: true, selectedRole: role }),
  closeDeleteRoleModal: () => set({ isDeleteRoleModalOpen: false, selectedRole: null }),

  // ==== USER ====
  isCreateUserModalOpen: false,
  isEditUserModalOpen: false,
  isDeleteUserModalOpen: false,
  selectedUser: null,
  openCreateUserModal: () => set({ isCreateUserModalOpen: true }),
  closeCreateUserModal: () => set({ isCreateUserModalOpen: false }),
  openEditUserModal: (user) => set({ isEditUserModalOpen: true, selectedUser: user }),
  closeEditUserModal: () => set({ isEditUserModalOpen: false, selectedUser: null }),
  openDeleteUserModal: (user) => set({ isDeleteUserModalOpen: true, selectedUser: user }),
  closeDeleteUserModal: () => set({ isDeleteUserModalOpen: false, selectedUser: null }),

  // ==== SERVER ====
  isCreateServerModalOpen: false,
  isEditServerModalOpen: false,
  isDeleteServerModalOpen: false,
  selectedServer: null,
  openCreateServerModal: () => set({ isCreateServerModalOpen: true }),
  closeCreateServerModal: () => set({ isCreateServerModalOpen: false }),
  openEditServerModal: (server) => set({ isEditServerModalOpen: true, selectedServer: server }),
  closeEditServerModal: () => set({ isEditServerModalOpen: false, selectedServer: null }),
  openDeleteServerModal: (server) => set({ isDeleteServerModalOpen: true, selectedServer: server }),
  closeDeleteServerModal: () => set({ isDeleteServerModalOpen: false, selectedServer: null }),

  // ==== CONFIGURATION ====
  isCreateConfigurationModalOpen: false,
  isEditConfigurationModalOpen: false,
  isDeleteConfigurationModalOpen: false,
  selectedConfiguration: null,
  openCreateConfigurationModal: () => set({ isCreateConfigurationModalOpen: true }),
  closeCreateConfigurationModal: () => set({ isCreateConfigurationModalOpen: false }),
  openEditConfigurationModal: (configuration) => set({ isEditConfigurationModalOpen: true, selectedConfiguration: configuration }),
  closeEditConfigurationModal: () => set({ isEditConfigurationModalOpen: false, selectedConfiguration: null }),
  openDeleteConfigurationModal: (configuration) => set({ isDeleteConfigurationModalOpen: true, selectedConfiguration: configuration }),
  closeDeleteConfigurationModal: () => set({ isDeleteConfigurationModalOpen: false, selectedConfiguration: null }),

  // ==== TEMPLATE ====
  isCreateTemplateModalOpen: false,
  isEditTemplateModalOpen: false,
  isDeleteTemplateModalOpen: false,
  selectedTemplate: null,
  openCreateTemplateModal: () => set({ isCreateTemplateModalOpen: true }),
  closeCreateTemplateModal: () => set({ isCreateTemplateModalOpen: false }),
  openEditTemplateModal: (template) => set({ isEditTemplateModalOpen: true, selectedTemplate: template }),
  closeEditTemplateModal: () => set({ isEditTemplateModalOpen: false, selectedTemplate: null }),
  openDeleteTemplateModal: (template) => set({ isDeleteTemplateModalOpen: true, selectedTemplate: template }),
  closeDeleteTemplateModal: () => set({ isDeleteTemplateModalOpen: false, selectedTemplate: null }),
  

  // ==== TEMPLATE CONFIGURATION ====
  isAttachConfigToTemplateModalOpen: false,
  isEditTemplateConfigurationModalOpen: false,
  isDeleteTemplateConfigurationModalOpen: false,
  selectedTemplateConfiguration: null,
  openAttachConfigToTemplateModal: (template) => set({ isAttachConfigToTemplateModalOpen: true, selectedTemplate: template }),
  closeAttachConfigToTemplateModal: () => set({ isAttachConfigToTemplateModalOpen: false, selectedTemplate: null }),
  openEditTemplateConfigurationModal: (tc) => set({ isEditTemplateConfigurationModalOpen: true, selectedTemplateConfiguration: tc }),
  closeEditTemplateConfigurationModal: () => set({ isEditTemplateConfigurationModalOpen: false, selectedTemplateConfiguration: null }),
  openDeleteTemplateConfigurationModal: (tc) => set({ isDeleteTemplateConfigurationModalOpen: true, selectedTemplateConfiguration: tc }),
  closeDeleteTemplateConfigurationModal: () => set({ isDeleteTemplateConfigurationModalOpen: false, selectedTemplateConfiguration: null }),

  // ==== ENVIRONMENT ====
  isCreateEnvironmentModalOpen: false,
  isEditEnvironmentModalOpen: false,
  isDeleteEnvironmentModalOpen: false,
  selectedEnvironment: null,
  openCreateEnvironmentModal: () => set({ isCreateEnvironmentModalOpen: true }),
  closeCreateEnvironmentModal: () => set({ isCreateEnvironmentModalOpen: false }),
  openEditEnvironmentModal: (environment) => set({ isEditEnvironmentModalOpen: true, selectedEnvironment: environment }),
  closeEditEnvironmentModal: () => set({ isEditEnvironmentModalOpen: false, selectedEnvironment: null }),
  openDeleteEnvironmentModal: (environment) => set({ isDeleteEnvironmentModalOpen: true, selectedEnvironment: environment }),
  closeDeleteEnvironmentModal: () => set({ isDeleteEnvironmentModalOpen: false, selectedEnvironment: null }),

  // ==== OS ====
  isCreateOsModalOpen: false,
  isEditOsModalOpen: false,
  isDeleteOsModalOpen: false,
  selectedOs: null,
  openCreateOsModal: () => set({ isCreateOsModalOpen: true }),
  closeCreateOsModal: () => set({ isCreateOsModalOpen: false }),
  openEditOsModal: (os) => set({ isEditOsModalOpen: true, selectedOs: os }),
  closeEditOsModal: () => set({ isEditOsModalOpen: false, selectedOs: null }),
  openDeleteOsModal: (os) => set({ isDeleteOsModalOpen: true, selectedOs: os }),
  closeDeleteOsModal: () => set({ isDeleteOsModalOpen: false, selectedOs: null }),

  // ==== PROJECT ====
  isCreateProjectModalOpen: false,
  isEditProjectModalOpen: false,
  isDeleteProjectModalOpen: false,
  selectedProject: null,
  openCreateProjectModal: () => set({ isCreateProjectModalOpen: true }),
  closeCreateProjectModal: () => set({ isCreateProjectModalOpen: false }),
  openEditProjectModal: (project) => set({ isEditProjectModalOpen: true, selectedProject: project }),
  closeEditProjectModal: () => set({ isEditProjectModalOpen: false, selectedProject: null }),
  openDeleteProjectModal: (project) => set({ isDeleteProjectModalOpen: true, selectedProject: project }),
  closeDeleteProjectModal: () => set({ isDeleteProjectModalOpen: false, selectedProject: null }),

  // ==== EXECUTION CRUD ====
  isCreateExecutionModalOpen: false,
  isEditExecutionModalOpen: false,
  isDeleteExecutionModalOpen: false,
  selectedExecution: null,
  openCreateExecutionModal: () => set({ isCreateExecutionModalOpen: true }),
  closeCreateExecutionModal: () => set({ isCreateExecutionModalOpen: false }),
  openEditExecutionModal: (execution) => set({ isEditExecutionModalOpen: true, selectedExecution: execution }),
  closeEditExecutionModal: () => set({ isEditExecutionModalOpen: false, selectedExecution: null }),
  openDeleteExecutionModal: (execution) => set({ isDeleteExecutionModalOpen: true, selectedExecution: execution }),
  closeDeleteExecutionModal: () => set({ isDeleteExecutionModalOpen: false, selectedExecution: null }),
  setSelectedExecution: (execution) => set({ selectedExecution: execution }),

  // ==== EXECUTION GROUP CRUD ====
  isCreateExecutionGroupModalOpen: false,
  isEditExecutionGroupModalOpen: false,
  isDeleteExecutionGroupModalOpen: false,
  selectedExecutionGroup: null,
  openCreateExecutionGroupModal: () => set({ isCreateExecutionGroupModalOpen: true }),
  closeCreateExecutionGroupModal: () => set({ isCreateExecutionGroupModalOpen: false }),
  openEditExecutionGroupModal: (group) => set({ isEditExecutionGroupModalOpen: true, selectedExecutionGroup: group }),
  closeEditExecutionGroupModal: () => set({ isEditExecutionGroupModalOpen: false, selectedExecutionGroup: null }),
  openDeleteExecutionGroupModal: (group) => set({ isDeleteExecutionGroupModalOpen: true, selectedExecutionGroup: group }),
  closeDeleteExecutionGroupModal: () => set({ isDeleteExecutionGroupModalOpen: false, selectedExecutionGroup: null }),
  setSelectedExecutionGroup: (group: ExecutionGroup | null) => set({ selectedExecutionGroup: group }),


  // ==== SERVER CONFIGURATION CRUD ====
  isCreateServerConfigurationModalOpen: false,
  isEditServerConfigurationModalOpen: false,
  isDeleteServerConfigurationModalOpen: false,
  selectedServerConfiguration: null,
  openCreateServerConfigurationModal: () => set({ isCreateServerConfigurationModalOpen: true }),
  closeCreateServerConfigurationModal: () => set({ isCreateServerConfigurationModalOpen: false }),
  openEditServerConfigurationModal: (sc) => set({ isEditServerConfigurationModalOpen: true, selectedServerConfiguration: sc }),
  closeEditServerConfigurationModal: () => set({ isEditServerConfigurationModalOpen: false, selectedServerConfiguration: null }),
  openDeleteServerConfigurationModal: (sc) => set({ isDeleteServerConfigurationModalOpen: true, selectedServerConfiguration: sc }),
  closeDeleteServerConfigurationModal: () => set({ isDeleteServerConfigurationModalOpen: false, selectedServerConfiguration: null }),

  // ==== SERVER TEMPLATE CRUD ====
  isCreateServerTemplateModalOpen: false,
  isEditServerTemplateModalOpen: false,
  isDeleteServerTemplateModalOpen: false,
  selectedServerTemplate: null,
  openCreateServerTemplateModal: () => set({ isCreateServerTemplateModalOpen: true }),
  closeCreateServerTemplateModal: () => set({ isCreateServerTemplateModalOpen: false }),
  openEditServerTemplateModal: (st) => set({ isEditServerTemplateModalOpen: true, selectedServerTemplate: st }),
  closeEditServerTemplateModal: () => set({ isEditServerTemplateModalOpen: false, selectedServerTemplate: null }),
  openDeleteServerTemplateModal: (st) => set({ isDeleteServerTemplateModalOpen: true, selectedServerTemplate: st }),
  closeDeleteServerTemplateModal: () => set({ isDeleteServerTemplateModalOpen: false, selectedServerTemplate: null }),

  // ==== EXECUTION ====
  isRunExecutionModalOpen: false,
  isReplayExecutionModalOpen: false,
  isReplayGroupModalOpen: false,
  isReplayServerTemplateModalOpen: false,
  isReplayServerConfigurationModalOpen: false,
  isRunConfigurationModalOpen: false,
  isRunTemplateModalOpen: false,

  
  
  
  

  openRunExecutionModal: () => set({ isRunExecutionModalOpen: true }),
  closeRunExecutionModal: () => set({ isRunExecutionModalOpen: false }),

  openReplayExecutionModal: (execution) => set({ isReplayExecutionModalOpen: true, selectedExecution: execution }),
  closeReplayExecutionModal: () => set({ isReplayExecutionModalOpen: false, selectedExecution: null }),

  openReplayGroupModal: (group) => set({ isReplayGroupModalOpen: true, selectedExecutionGroup: group }),
  closeReplayGroupModal: () => set({ isReplayGroupModalOpen: false, selectedExecutionGroup: null }),

  openReplayServerTemplateModal: (serverTemplate) => set({ isReplayServerTemplateModalOpen: true, selectedServerTemplate: serverTemplate }),
  closeReplayServerTemplateModal: () => set({ isReplayServerTemplateModalOpen: false, selectedServerTemplate: null }),

  openReplayServerConfigurationModal: (sc) => set({ isReplayServerConfigurationModalOpen: true, selectedServerConfiguration: sc }),
  closeReplayServerConfigurationModal: () => set({ isReplayServerConfigurationModalOpen: false, selectedServerConfiguration: null }),

  openRunConfigurationModal: (configuration) => set({ isRunConfigurationModalOpen: true, selectedConfiguration: configuration }),
  closeRunConfigurationModal: () => set({ isRunConfigurationModalOpen: false, selectedConfiguration: null }),

  openRunTemplateModal: (template) => set({ isRunTemplateModalOpen: true, selectedTemplate: template }),
  closeRunTemplateModal: () => set({ isRunTemplateModalOpen: false, selectedTemplate: null }),


   // ==== STEPPER EXECUTION CUSTOM ====
  draftExecutionGroups: [],
  isStepperExecutionModalOpen: false,
  openStepperExecutionModal: () => set({ isStepperExecutionModalOpen: true }),
  closeStepperExecutionModal: () => set({ isStepperExecutionModalOpen: false }),
  addDraftGroup: (group) => set((state) => ({ draftExecutionGroups: [...state.draftExecutionGroups, group] })),
  openEditDraftExecutionGroupModal: (index) => set({
  isEditExecutionGroupModalOpen: true,
  selectedDraftGroupIndex: index,
  }),
  removeDraftGroup: (index) =>
    set((state) => ({ draftExecutionGroups: state.draftExecutionGroups.filter((_, i) => i !== index) })),
  clearDraftGroups: () => set({ draftExecutionGroups: [] }),
  selectedDraftGroupIndex: null,
  setSelectedDraftGroupIndex: (index) => set({ selectedDraftGroupIndex: index }),

  
}))




