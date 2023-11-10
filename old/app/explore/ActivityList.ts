import { RealtimeChannel } from "@supabase/supabase-js";
import { DomNode, el, Store, Supabase } from "common-app-module";
import SubjectTradeEvent from "../database-interface/SubjectTradeEvent.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";
import UserService from "../user/UserService.js";
import ActivityListItem from "./ActivityListItem.js";

export default class ActivityList extends DomNode {
  private store: Store = new Store("activity-list");
  private isContentFromCache: boolean = true;
  private contentFetched: boolean = false;
  private emptyMessageDisplay: DomNode | undefined;
  private channel: RealtimeChannel;

  constructor() {
    super(".activity-list");
    this.showEmptyMessage();

    const cachedSubjectContractEvents = this.store.get<SubjectTradeEvent[]>(
      "cached-subject-trade-events",
    );
    if (cachedSubjectContractEvents) {
      for (const event of cachedSubjectContractEvents) {
        this.addSubjectContractEvent(event);
      }
    }

    this.channel = Supabase.client
      .channel("activity-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "subject_trade_events",
        },
        (payload: any) => {
          const cachedEvents = this.store.get<SubjectTradeEvent[]>(
            "cached-subject-trade-events",
          ) ?? [];
          cachedEvents.push(payload.new);
          this.store.set("cached-subject-trade-events", cachedEvents, true);
          this.addSubjectContractEvent(payload.new);
        },
      )
      .subscribe();
  }

  private showEmptyMessage() {
    this.emptyMessageDisplay?.delete();
    this.emptyMessageDisplay = el("p.empty-message", "No activities yet");
    this.emptyMessageDisplay.on(
      "delete",
      () => this.emptyMessageDisplay = undefined,
    );
    this.append(this.emptyMessageDisplay);
  }

  private addSubjectContractEvent(event: SubjectTradeEvent) {
    this.emptyMessageDisplay?.delete();
    this.append(new ActivityListItem(event));
  }

  private async fetchActivities() {
    const { data, error } = await Supabase.client.from(
      "subject_trade_events",
    ).select()
      .order(
        "block_number",
        { ascending: false },
      ).order(
        "log_index",
        { ascending: false },
      ).limit(100);
    if (error) throw error;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-subject-trade-events", data, true);
      await this.fetchUsers(data);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      if (data.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const event of data) {
          this.addSubjectContractEvent(event);
        }
      }
    }
  }

  private async fetchUsers(subjectContractEvents: SubjectTradeEvent[]) {
    const walletAddresses = new Set<string>();
    for (const event of subjectContractEvents) {
      walletAddresses.add(event.wallet_address);
      walletAddresses.add(event.subject);
    }
    const userDetailsSet = await UserService.fetchByWalletAddresses(
      Array.from(walletAddresses),
    );
    UserDetailsCacher.cacheMultiple(userDetailsSet);
  }

  public show() {
    this.deleteClass("hidden");
    if (!this.contentFetched) {
      this.fetchActivities();
      this.contentFetched = true;
    }
  }

  public hide() {
    this.addClass("hidden");
  }

  public delete() {
    this.channel.unsubscribe();
    super.delete();
  }
}
