export const modules: any = {};

export function setMonitoringModule(moduleName: string, module: any): void {
  modules[moduleName] = module;
}
