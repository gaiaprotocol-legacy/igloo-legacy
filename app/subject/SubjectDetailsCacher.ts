import { EventContainer, Store, Supabase } from "common-dapp-module";
import SubjectDetails, {
    DefaultSubjectDetails,
    SubjectDetailsSelectQuery,
    isEqualSubjectDetails,
} from "../database-interface/SubjectDetails.js";

class SubjectDetailsCacher extends EventContainer {
  private store: Store = new Store("cached-subject-details");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }

  public init() {
    Supabase.client.channel("subject-details-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "subject_details",
    }, (payload) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        this.refresh(payload.new.subject);
      }
    }).subscribe();
  }

  private cache(subject: string, subjectDetails: SubjectDetails) {
    if (!isEqualSubjectDetails(subjectDetails, this.get(subject))) {
      this.store.set(subject, subjectDetails, true);
      this.fireEvent("update", subjectDetails);
    }
  }

  public get(subject: string): SubjectDetails {
    const cached = this.store.get<SubjectDetails>(subject);
    if (cached) {
      return cached;
    } else {
      return { ...DefaultSubjectDetails, subject };
    }
  }

  public async refresh(subject: string) {
    const { data, error } = await Supabase.client.from("subject_details")
      .select(
        SubjectDetailsSelectQuery,
      ).eq("subject", subject);
    if (error) throw error;
    const subjectDetails: SubjectDetails | undefined = data?.[0] as any;
    if (
      subjectDetails &&
      !isEqualSubjectDetails(subjectDetails, this.get(subject))
    ) {
      this.cache(subject, subjectDetails);
    }
  }

  public getAndRefresh(subject: string): SubjectDetails {
    const cachedValue = this.get(subject);
    this.refresh(subject).catch((error) =>
      console.error("Error refreshing subject details:", error)
    );
    return cachedValue;
  }
}

export default new SubjectDetailsCacher();
