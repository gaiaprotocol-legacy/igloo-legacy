import { Supabase } from "common-app-module";
import SubjectDetails, {
  SubjectDetailsSelectQuery,
} from "../database-interface/SubjectDetails.js";

class SubjectService {
  public async fetchSubject(
    subject: string,
  ): Promise<SubjectDetails | undefined> {
    const { data, error } = await Supabase.client.from("subject_details")
      .select(SubjectDetailsSelectQuery)
      .eq(
        "subject",
        subject,
      );
    if (error) throw error;
    return data?.[0] as any;
  }

  public async fetchHoldingSubjects(
    walletAddress: string,
  ): Promise<SubjectDetails[]> {
    const { data: holderData, error: holderError } = await Supabase.client.from(
      "subject_key_holders",
    )
      .select("subject")
      .eq(
        "wallet_address",
        walletAddress,
      ).gt("last_fetched_balance", 0);
    if (holderError) throw holderError;
    const subjects = holderData.map((holder) => holder.subject);
    const { data: subjectData, error: subjectError } = await Supabase.client
      .from("subject_details")
      .select(SubjectDetailsSelectQuery)
      .in(
        "subject",
        subjects,
      );
    if (subjectError) throw subjectError;
    return subjectData as any;
  }

  public async fetchFollowingSubjects(
    userId: string,
  ): Promise<SubjectDetails[]> {
    const { data: followsData, error: followsError } = await Supabase.client
      .from("follows").select("followee_id").eq(
        "follower_id",
        userId,
      ).order(
        "followed_at",
        { ascending: false },
      );
    if (followsError) throw followsError;
    const followeeIds = followsData.map((follow) => follow.followee_id);
    const { data: userData, error: userError } = await Supabase.client.from(
      "user_details",
    ).select()
      .in(
        "user_id",
        followeeIds,
      );
    if (userError) throw userError;
    const walletAddresses = userData.map((user) => user.wallet_address);
    const { data: subjectData, error: subjectError } = await Supabase.client
      .from("subject_details").select(SubjectDetailsSelectQuery)
      .in(
        "subject",
        walletAddresses,
      );
    if (subjectError) throw subjectError;
    return subjectData as any;
  }
}

export default new SubjectService();
