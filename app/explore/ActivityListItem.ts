import { DomNode } from "common-dapp-module";
import SubjectContractEvent from "../database-interface/SubjectContractEvent.js";

export default class ActivityListItem extends DomNode {
  constructor(subjectContractEvent: SubjectContractEvent) {
    super(".activity-list-item");
    console.log(subjectContractEvent);
  }
}
