import { DomNode, el } from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import SubjectListItem from "./SubjectListItem.js";

export default abstract class SubjectList extends DomNode {
  private emptyMessageDisplay: DomNode | undefined;

  constructor(tag: string, private emptyMessage: string) {
    super(tag + ".subject-list");
    this.showEmptyMessage();
  }

  private showEmptyMessage() {
    this.emptyMessageDisplay?.delete();
    this.emptyMessageDisplay = el("p.empty-message", this.emptyMessage);
    this.emptyMessageDisplay.on(
      "delete",
      () => this.emptyMessageDisplay = undefined,
    );
    this.append(this.emptyMessageDisplay);
  }

  protected addSubjectDetails(subjectDetails: SubjectDetails) {
    this.emptyMessageDisplay?.delete();
    this.append(new SubjectListItem(subjectDetails));
  }

  public empty(): this {
    super.empty();
    this.showEmptyMessage();
    return this;
  }
}
