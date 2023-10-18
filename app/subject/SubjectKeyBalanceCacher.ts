import { EventContainer, Store, Supabase } from "common-dapp-module";

class SubjectKeyBalanceCacher extends EventContainer {
  private store: Store = new Store("cached-subject-key-balances");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }

  public init() {
    Supabase.client.channel("subject-key-balances-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "subject_key_holders",
      },
      (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          this.refresh(payload.new.subject, payload.new.wallet_address);
        }
      },
    ).subscribe();
  }

  private cache(subject: string, walletAddress: string, balance: number) {
    if (balance !== this.get(subject, walletAddress)) {
      this.store.set(`${subject}-${walletAddress}`, balance, true);
      this.fireEvent("update", { subject, walletAddress, balance });
    }
  }

  public get(subject: string, walletAddress: string): number {
    const cached = this.store.get<number>(`${subject}-${walletAddress}`);
    if (cached) {
      return cached;
    } else {
      return 0;
    }
  }

  public async refresh(subject: string, walletAddress: string) {
    const { data, error } = await Supabase.client.from(
      "subject_key_holders",
    )
      .select(
        "*, last_fetched_balance::text",
      ).eq("wallet_address", walletAddress);
    if (error) throw error;
    const balanceData: any | undefined = data?.[0] as any;
    if (
      balanceData &&
      balanceData.last_fetched_balance !== this.get(subject, walletAddress)
    ) {
      this.cache(subject, walletAddress, balanceData.total_key_balance);
    }
  }

  public getAndRefresh(subject: string, walletAddress: string): number {
    const cachedValue = this.get(subject, walletAddress);
    this.refresh(subject, walletAddress).catch((error) =>
      console.error("Error refreshing subject key balance details:", error)
    );
    return cachedValue;
  }

  public increaseKeyBalanceInstantly(walletAddress: string, subject: string) {
    const cachedValue = this.get(subject, walletAddress);
    this.cache(subject, walletAddress, cachedValue + 1);
  }
}

export default new SubjectKeyBalanceCacher();
