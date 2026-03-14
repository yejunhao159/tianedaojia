export interface PromptBuilder<TSystem = Record<string, unknown>, TUser = Record<string, unknown>> {
  id: string;
  name: string;
  buildSystem: (vars?: TSystem) => string;
  buildUser: (vars: TUser) => string;
}
