import { DomNode, el, View, ViewParams } from "common-app-module";
import FollowingSubjectList from "../chat-subject/FollowingSubjectList.js";
import HoldingSubjectList from "../chat-subject/HoldingSubjectList.js";
import MySubjectList from "../chat-subject/MySubjectList.js";
import GeneralTopicList from "../chat-topic/GeneralTopicList.js";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";
import LoginRequired from "../user/LoginRequired.js";

export default class ChatsView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(this.container = el(".chats-view"));

    this.render();
    this.container.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.render(),
    );
  }

  private render() {
    this.container.empty().append(el("h1", "Chats"));
    if (!SignedUserManager.signed) {
      this.container.append(
        el(
          "main",
          el("section.chat", el("h2", "General"), new GeneralTopicList()),
          new LoginRequired(),
        ),
      );
    } else {
      this.container.append(
        el(
          "main",
          el("section.chat", el("h2", "General"), new GeneralTopicList()),
          el("section.chat", el("h2", "My"), new MySubjectList()),
          el("section.chat", el("h2", "Holding"), new HoldingSubjectList()),
          //el("section.chat", el("h2", "Following"), new FollowingSubjectList()),
        ),
      );
    }
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
