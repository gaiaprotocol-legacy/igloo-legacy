import { EventContainer, Store } from "common-dapp-module";

class TotalSubjectKeyBalanceCacher extends EventContainer {
  private store: Store = new Store("cached-total-subject-key-balances");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }
}

export default new TotalSubjectKeyBalanceCacher();
