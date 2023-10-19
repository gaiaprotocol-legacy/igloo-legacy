import { Supabase } from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";

class SubjectService {
  public async fetchSubject(
    subject: string,
  ): Promise<SubjectDetails | undefined> {
    const { data, error } = await Supabase.client.from("subject_details")
      .select()
      .eq(
        "subject",
        subject,
      );
    if (error) throw error;
    return data?.[0];
  }

  public async fetchHoldingSubjects(
    walletAddress: string,
  ): Promise<SubjectDetails[]> {
    const { data: holderData, error: holderError } = await Supabase.client.from(
      "subject_key_holders",
    )
      .select()
      .eq(
        "wallet_address",
        walletAddress,
      );
    if (holderError) throw holderError;
    const subjects = holderData.map((holder) => holder.subject);
    const { data: subjectData, error: subjectError } = await Supabase.client
      .from("subject_details")
      .select()
      .in(
        "subject",
        subjects,
      );
    if (subjectError) throw subjectError;
    return subjectData;
  }

  public async fetchFollowingSubjects(
    userId: string,
  ): Promise<SubjectDetails[]> {
    const { data: followsData, error: followsError } = await Supabase.client
      .from("follows").select().eq(
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
      .from("subject_details").select()
      .in(
        "subject",
        walletAddresses,
      );
    if (subjectError) throw subjectError;
    return subjectData;
  }
}

export default new SubjectService();
