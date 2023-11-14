import { Component, el, Popup } from "common-app-module";
import { PostTarget } from "../database-interface/IglooPost.js";
import MaterialIcon from "../MaterialIcon.js";
import IglooPostForm from "./IglooPostForm.js";

export default class PostPopup extends Popup {
  private form: IglooPostForm;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      new Component(
        ".popup.post-popup",
        el(
          "header",
          el(
            "select",
            el("option", { value: String(PostTarget.EVERYONE) }, "Everyone"),
            el(
              "option",
              { value: String(PostTarget.KEY_HOLDERS) },
              "Key Holders",
            ),
            {
              change: (event, select) =>
                this.form.target = Number(
                  (select.domElement as HTMLSelectElement).value,
                ),
            },
          ),
          el("button", new MaterialIcon("close"), {
            click: () => this.delete(),
          }),
        ),
        this.form = new IglooPostForm(undefined, true, () => this.delete()),
      ),
    );
  }
}
