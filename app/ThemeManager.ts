import { Store } from "common-app-module";

class ThemeManager {
  private store = new Store("__THEME_MANAGER_STORE");

  public get darkMode() {
    return this.store.get<boolean>("dark") || false;
  }

  public set darkMode(value: boolean) {
    this.store.set("dark", value);
  }
}

export default new ThemeManager();
