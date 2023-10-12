import { Component, DomNode, el, Popup } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";

export default class BuySubjectKeyPopup extends Popup {
  public content: DomNode;

  constructor(userDetails: UserDetails) {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.buy-subject-key-popup",
        el("header", el("h1", `Buy ${userDetails.display_name}'s Key`)),
        //TODO:
      ),
    );
  }
}
