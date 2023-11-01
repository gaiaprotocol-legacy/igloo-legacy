import { BodyNode, Store } from "common-app-module";

class ThemeManager {
  private store = new Store("__THEME_MANAGER_STORE");

  constructor() {
    this.darkMode = this.darkMode;
  }

  public get darkMode() {
    return this.store.get<boolean>("dark") || false;
  }

  public set darkMode(value: boolean) {
    this.store.set("dark", value);
    value ? BodyNode.addClass("dark-mode") : BodyNode.deleteClass("dark-mode");
  }
}

export default new ThemeManager();
