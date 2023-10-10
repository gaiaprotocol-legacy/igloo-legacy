import { DomNode } from "common-dapp-module";

export default abstract class UserList extends DomNode {
  constructor(tag: string) {
    super(tag + ".user-list");
  }
}
