import { DomNode } from "common-dapp-module";

export default abstract class PostList extends DomNode {
  constructor(tag: string) {
    super(tag + ".post-list");
  }
}
