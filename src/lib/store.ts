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
} from "@/types/entities"

interface ModalState {
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
  isRunConfigurationModalOpen: boolean
  isRunTemplateModalOpen: boolean
  selectedUser: User | null
  selectedServer: Server | null
  selectedConfiguration: Configuration | null
  selectedTemplate: Template | null
  selectedRole: Role | null
  selectedEnvironment: Environment | null
  selectedOs: OperatingSystem | null
  selectedProject: Project | null
  selectedExecution: Execution | null
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
  openRunConfigurationModal: (configuration: Configuration) => void
  closeRunConfigurationModal: () => void
  openRunTemplateModal: (template: Template) => void
  closeRunTemplateModal: () => void
}

type Store = ModalState & ModalActions

export const useStore = create<Store>((set) => ({
  // Modal states
  isCreateUserModalOpen: false,
  isEditUserModalOpen: false,
  isDeleteUserModalOpen: false,
  isCreateServerModalOpen: false,
  isEditServerModalOpen: false,
  isDeleteServerModalOpen: false,
  isCreateConfigurationModalOpen: false,
  isEditConfigurationModalOpen: false,
  isDeleteConfigurationModalOpen: false,
  isCreateTemplateModalOpen: false,
  isEditTemplateModalOpen: false,
  isDeleteTemplateModalOpen: false,
  isCreateRoleModalOpen: false,
  isEditRoleModalOpen: false,
  isDeleteRoleModalOpen: false,
  isCreateEnvironmentModalOpen: false,
  isEditEnvironmentModalOpen: false,
  isDeleteEnvironmentModalOpen: false,
  isCreateOsModalOpen: false,
  isEditOsModalOpen: false,
  isDeleteOsModalOpen: false,
  isCreateProjectModalOpen: false,
  isEditProjectModalOpen: false,
  isDeleteProjectModalOpen: false,
  isRunConfigurationModalOpen: false,
  isRunTemplateModalOpen: false,

  // Selected items
  selectedUser: null,
  selectedServer: null,
  selectedConfiguration: null,
  selectedTemplate: null,
  selectedRole: null,
  selectedEnvironment: null,
  selectedOs: null,
  selectedProject: null,
  selectedExecution: null,

  // User modal actions
  openCreateUserModal: () => set({ isCreateUserModalOpen: true }),
  closeCreateUserModal: () => set({ isCreateUserModalOpen: false }),
  openEditUserModal: (user) => set({ isEditUserModalOpen: true, selectedUser: user }),
  closeEditUserModal: () => set({ isEditUserModalOpen: false, selectedUser: null }),
  openDeleteUserModal: (user) => set({ isDeleteUserModalOpen: true, selectedUser: user }),
  closeDeleteUserModal: () => set({ isDeleteUserModalOpen: false, selectedUser: null }),

  // Server modal actions
  openCreateServerModal: () => set({ isCreateServerModalOpen: true }),
  closeCreateServerModal: () => set({ isCreateServerModalOpen: false }),
  openEditServerModal: (server) => set({ isEditServerModalOpen: true, selectedServer: server }),
  closeEditServerModal: () => set({ isEditServerModalOpen: false, selectedServer: null }),
  openDeleteServerModal: (server) => set({ isDeleteServerModalOpen: true, selectedServer: server }),
  closeDeleteServerModal: () => set({ isDeleteServerModalOpen: false, selectedServer: null }),

  // Configuration modal actions
  openCreateConfigurationModal: () => set({ isCreateConfigurationModalOpen: true }),
  closeCreateConfigurationModal: () => set({ isCreateConfigurationModalOpen: false }),
  openEditConfigurationModal: (configuration) =>
    set({ isEditConfigurationModalOpen: true, selectedConfiguration: configuration }),
  closeEditConfigurationModal: () => set({ isEditConfigurationModalOpen: false, selectedConfiguration: null }),
  openDeleteConfigurationModal: (configuration) =>
    set({ isDeleteConfigurationModalOpen: true, selectedConfiguration: configuration }),
  closeDeleteConfigurationModal: () => set({ isDeleteConfigurationModalOpen: false, selectedConfiguration: null }),

  // Template modal actions
  openCreateTemplateModal: () => set({ isCreateTemplateModalOpen: true }),
  closeCreateTemplateModal: () => set({ isCreateTemplateModalOpen: false }),
  openEditTemplateModal: (template) => set({ isEditTemplateModalOpen: true, selectedTemplate: template }),
  closeEditTemplateModal: () => set({ isEditTemplateModalOpen: false, selectedTemplate: null }),
  openDeleteTemplateModal: (template) => set({ isDeleteTemplateModalOpen: true, selectedTemplate: template }),
  closeDeleteTemplateModal: () => set({ isDeleteTemplateModalOpen: false, selectedTemplate: null }),

  // Role modal actions
  openCreateRoleModal: () => set({ isCreateRoleModalOpen: true }),
  closeCreateRoleModal: () => set({ isCreateRoleModalOpen: false }),
  openEditRoleModal: (role) => set({ isEditRoleModalOpen: true, selectedRole: role }),
  closeEditRoleModal: () => set({ isEditRoleModalOpen: false, selectedRole: null }),
  openDeleteRoleModal: (role) => set({ isDeleteRoleModalOpen: true, selectedRole: role }),
  closeDeleteRoleModal: () => set({ isDeleteRoleModalOpen: false, selectedRole: null }),

  // Environment modal actions
  openCreateEnvironmentModal: () => set({ isCreateEnvironmentModalOpen: true }),
  closeCreateEnvironmentModal: () => set({ isCreateEnvironmentModalOpen: false }),
  openEditEnvironmentModal: (environment) =>
    set({ isEditEnvironmentModalOpen: true, selectedEnvironment: environment }),
  closeEditEnvironmentModal: () => set({ isEditEnvironmentModalOpen: false, selectedEnvironment: null }),
  openDeleteEnvironmentModal: (environment) =>
    set({ isDeleteEnvironmentModalOpen: true, selectedEnvironment: environment }),
  closeDeleteEnvironmentModal: () => set({ isDeleteEnvironmentModalOpen: false, selectedEnvironment: null }),

  // OS modal actions
  openCreateOsModal: () => set({ isCreateOsModalOpen: true }),
  closeCreateOsModal: () => set({ isCreateOsModalOpen: false }),
  openEditOsModal: (os) => set({ isEditOsModalOpen: true, selectedOs: os }),
  closeEditOsModal: () => set({ isEditOsModalOpen: false, selectedOs: null }),
  openDeleteOsModal: (os) => set({ isDeleteOsModalOpen: true, selectedOs: os }),
  closeDeleteOsModal: () => set({ isDeleteOsModalOpen: false, selectedOs: null }),

  // Project modal actions
  openCreateProjectModal: () => set({ isCreateProjectModalOpen: true }),
  closeCreateProjectModal: () => set({ isCreateProjectModalOpen: false }),
  openEditProjectModal: (project) => set({ isEditProjectModalOpen: true, selectedProject: project }),
  closeEditProjectModal: () => set({ isEditProjectModalOpen: false, selectedProject: null }),
  openDeleteProjectModal: (project) => set({ isDeleteProjectModalOpen: true, selectedProject: project }),
  closeDeleteProjectModal: () => set({ isDeleteProjectModalOpen: false, selectedProject: null }),

  // Run modal actions
  openRunConfigurationModal: (configuration) =>
    set({ isRunConfigurationModalOpen: true, selectedConfiguration: configuration }),
  closeRunConfigurationModal: () => set({ isRunConfigurationModalOpen: false, selectedConfiguration: null }),
  openRunTemplateModal: (template) => set({ isRunTemplateModalOpen: true, selectedTemplate: template }),
  closeRunTemplateModal: () => set({ isRunTemplateModalOpen: false, selectedTemplate: null }),
}))
