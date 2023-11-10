import { EventContainer, Store, Supabase } from "common-app-module";

class TotalSubjectKeyBalanceCacher extends EventContainer {
  private store: Store = new Store("cached-total-subject-key-balances");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }

  public init() {
    Supabase.client.channel("total-subject-key-balances-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "total_subject_key_balances",
      },
      (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          this.refresh(payload.new.wallet_address);
        }
      },
    ).subscribe();
  }

  private cache(walletAddress: string, totalKeyBalance: number) {
    if (totalKeyBalance !== this.get(walletAddress)) {
      this.store.set(walletAddress, totalKeyBalance, true);
      this.fireEvent("update", { walletAddress, totalKeyBalance });
    }
  }

  public get(walletAddress: string): number {
    const cached = this.store.get<number>(walletAddress);
    if (cached) {
      return cached;
    } else {
      return 0;
    }
  }

  public async refresh(walletAddress: string) {
    const { data, error } = await Supabase.client.from(
      "total_subject_key_balances",
    )
      .select(
        "*, total_key_balance::text",
      ).eq("wallet_address", walletAddress);
    if (error) throw error;
    const balanceData: any | undefined = data?.[0] as any;
    if (
      balanceData &&
      balanceData.total_key_balance !== this.get(walletAddress)
    ) {
      this.cache(walletAddress, balanceData.total_key_balance);
    }
    if (balanceData?.total_key_balance) {
      return balanceData.total_key_balance;
    } else {
      return 0;
    }
  }

  public getAndRefresh(walletAddress: string): number {
    const cachedValue = this.get(walletAddress);
    this.refresh(walletAddress).catch((error) =>
      console.error(
        "Error refreshing total subject key balance details:",
        error,
      )
    );
    return cachedValue;
  }
}

export default new TotalSubjectKeyBalanceCacher();
