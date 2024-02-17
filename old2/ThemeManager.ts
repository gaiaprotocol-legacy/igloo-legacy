import { Store } from "@common-module/app";

class ThemeManager {
  private store = new Store("__THEME_MANAGER_STORE");
  private themeColor = document.querySelector('meta[name="theme-color"]');

  constructor() {
    this.darkMode = this.darkMode;
  }

  public get darkMode() {
    return this.store.get<boolean>("dark") || false;
  }

  public set darkMode(darkMode: boolean) {
    this.store.set("dark", darkMode, true);
    darkMode
      ? document.documentElement.classList.add("dark-mode")
      : document.documentElement.classList.remove("dark-mode");
    this.themeColor?.setAttribute("content", darkMode ? "#333" : "#EBEFF3");
  }
}

export default new ThemeManager();
