import { EventContainer, Store } from "common-dapp-module";

class SubjectKeyBalanceCacher extends EventContainer {
  private store: Store = new Store("cached-subject-key-balances");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }

  public increaseKeyBalance(walletAddress: string, subject: string) {
    //TODO:
  }
}

export default new SubjectKeyBalanceCacher();
