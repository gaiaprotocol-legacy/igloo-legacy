import { Store } from "common-app-module";

class ThemeManager {
  private store = new Store("__THEME_MANAGER_STORE");

  constructor() {
    this.darkMode = this.darkMode;
  }

  public get darkMode() {
    return this.store.get<boolean>("dark") || false;
  }

  public set darkMode(value: boolean) {
    this.store.set("dark", value, true);
    value
      ? document.documentElement.classList.add("dark-mode")
      : document.documentElement.classList.remove("dark-mode");
  }
}

export default new ThemeManager();
