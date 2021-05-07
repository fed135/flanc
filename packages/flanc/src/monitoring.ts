export const modules: any = {};

export function setMonitoringModule(moduleName, module) {
  modules[moduleName] = module;
}
