import { create } from "zustand"

type ExecutionEventsState = {
  logs: Record<number, string> // group_id => stdout
  configs: Record<number, any> // server_config_id => data
  setLog: (groupId: number, log: string) => void
  setConfig: (scId: number, data: any) => void
  reset: () => void
}

export const useExecutionEventsStore = create<ExecutionEventsState>((set) => ({
  logs: {},
  configs: {},
  setLog: (groupId, log) =>
    set((s) => ({ logs: { ...s.logs, [groupId]: log } })),
  setConfig: (scId, data) =>
    set((s) => ({ configs: { ...s.configs, [scId]: data } })),
  reset: () => set({ logs: {}, configs: {} }),
}))