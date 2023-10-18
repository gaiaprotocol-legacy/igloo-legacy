import { DomNode } from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";

export default class SubjectListItem extends DomNode {
  constructor(subjectDetails: SubjectDetails) {
    super(".subject-list-item");
  }
}
