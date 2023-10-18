import { DomNode } from "common-dapp-module";

export default abstract class SubjectList extends DomNode {
  constructor(tag: string) {
    super(tag + ".subject-list");
  }
}
