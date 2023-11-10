class EnvironmentManager {
  public dev: boolean = false;
  public avaxRpc!: string;
  public avaxChainId!: number;
}

export default new EnvironmentManager();
