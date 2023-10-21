import { DomNode, el, Store, Supabase } from "common-dapp-module";
import SubjectContractEvent from "../database-interface/SubjectContractEvent.js";
import ActivityListItem from "./ActivityListItem.js";

export default class ActivityList extends DomNode {
  private store: Store = new Store("activity-list");
  private isContentFromCache: boolean = true;
  private contentFetched: boolean = false;
  private emptyMessageDisplay: DomNode | undefined;

  constructor() {
    super(".activity-list");
    this.showEmptyMessage();

    const cachedSubjectContractEvents = this.store.get<SubjectContractEvent[]>(
      "cached-subject-contract-events",
    );
    if (cachedSubjectContractEvents) {
      for (const event of cachedSubjectContractEvents) {
        this.addSubjectContractEvent(event);
      }
    }
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

  private addSubjectContractEvent(event: SubjectContractEvent) {
    this.emptyMessageDisplay?.delete();
    this.append(new ActivityListItem(event));
  }

  private async fetchActivities() {
    const { data: subjectContractEvents, error } = await Supabase.client.from(
      "subject_contract_events",
    ).select()
      .order(
        "block_number",
        { ascending: false },
      ).order(
        "log_index",
        { ascending: false },
      );
    if (error) throw error;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set(
        "cached-subject-contract-events",
        subjectContractEvents,
        true,
      );
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      for (const event of subjectContractEvents) {
        this.addSubjectContractEvent(event);
      }
    }
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
}
