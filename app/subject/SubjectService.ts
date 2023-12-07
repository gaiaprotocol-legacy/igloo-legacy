import { Supabase, SupabaseService } from "common-app-module";
import IglooUser from "../database-interface/IglooUser.js";
import Subject, { SubjectsSelectQuery } from "../database-interface/Subject.js";

class SubjectService extends SupabaseService<Subject> {
  constructor() {
    super("subjects", SubjectsSelectQuery, 50);
  }

  public async fetchSubject(subject: string): Promise<Subject | undefined> {
    return await this.safeSelectSingle((b) => b.eq("subject", subject));
  }

  protected enhanceSubjectData(subjects: Subject[]): {
    subjects: Subject[];
    owners: IglooUser[];
  } {
    const _subjects = Supabase.safeResult<Subject[]>(subjects) ?? [];
    const owners: IglooUser[] = [];

    for (const subject of _subjects as any) {
      owners.push({
        user_id: subject.owner_user_id,
        wallet_address: subject.owner_wallet_address,
        total_earned_trading_fees: subject.owner_total_earned_trading_fees,
        display_name: subject.owner_display_name,
        profile_image: subject.owner_profile_image,
        profile_image_thumbnail: subject.owner_profile_image_thumbnail,
        x_username: subject.owner_x_username,
        metadata: subject.owner_metadata,
        follower_count: subject.owner_follower_count,
        following_count: subject.owner_following_count,
        blocked: subject.owner_blocked,
        created_at: subject.owner_created_at,
        updated_at: subject.owner_updated_at,
      });
    }

    return { subjects: _subjects, owners };
  }

  public async fetchFollowingSubjects(userId: string) {
    const { data, error } = await Supabase.client.rpc(
      "get_following_subjects",
      {
        p_user_id: userId,
      },
    );
    if (error) throw error;
    return this.enhanceSubjectData(data ?? []);
  }

  public async fetchKeyHeldSubjects(
    userId: string,
    walletAddress: string,
  ) {
    const { data, error } = await Supabase.client.rpc("get_key_held_subjects", {
      p_user_id: userId,
      p_wallet_address: walletAddress,
    });
    if (error) throw error;
    return this.enhanceSubjectData(data ?? []);
  }
}

export default new SubjectService();
