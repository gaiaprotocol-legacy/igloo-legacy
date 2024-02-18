import { el, View, ViewParams, WarningMessageBox } from "@common-module/app";
import { HESFLayout } from "hesf";

export default class AboutView extends View {
  constructor(params: ViewParams, uri: string) {
    super();
    HESFLayout.append(
      this.container = el(
        ".about-view",
      ),
    );
  }
}
