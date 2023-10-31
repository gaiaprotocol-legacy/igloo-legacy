import { Supabase } from "common-app-module";
import IglooSubjectContract from "../contracts/IglooSubjectContract.js";
import SignedUserManager from "../user/SignedUserManager.js";
import SubjectKeyBalanceCacher from "./SubjectKeyBalanceCacher.js";

class SubjectKeyService {
  public async buyKey(subject: string): Promise<void> {
    await IglooSubjectContract.buyKeys(
      subject,
      1n,
      await IglooSubjectContract.getBuyPriceAfterFee(subject, 1n),
    );

    Supabase.client.functions.invoke("track-subject-events");
    Supabase.client.functions.invoke("track-subject-price-and-balance", {
      body: { subjects: [subject] },
    });

    SubjectKeyBalanceCacher.increaseKeyBalanceInstantly(
      SignedUserManager.userId!,
      subject,
    );
  }

  public async sellKey(subject: string): Promise<void> {
    await IglooSubjectContract.sellKeys(subject, 1n);

    Supabase.client.functions.invoke("track-subject-events");
    Supabase.client.functions.invoke("track-subject-price-and-balance", {
      body: { subjects: [subject] },
    });

    SubjectKeyBalanceCacher.decreaseKeyBalanceInstantly(
      SignedUserManager.userId!,
      subject,
    );
  }

  public async fetchPortfolioValue(walletAddress: string): Promise<bigint> {
    const { data: holderData, error: holderError } = await Supabase.client
      .from("subject_key_holders")
      .select(
        "subject, last_fetched_balance::text",
      ).eq("wallet_address", walletAddress);
    if (holderError) throw holderError;
    const subjects = holderData.map((row: any) => row.subject);
    const { data: subjectData, error: subjectError } = await Supabase.client
      .from("subject_details")
      .select("subject, last_fetched_key_price::text")
      .in(
        "subject",
        subjects,
      );
    if (subjectError) throw subjectError;
    let portfolioValue = 0n;
    for (const subject of subjects) {
      const holder: any = holderData.find((row: any) =>
        row.subject === subject
      );
      const subjectDetails: any = subjectData.find((row: any) =>
        row.subject === subject
      );
      if (holder && subjectDetails) {
        portfolioValue += BigInt(holder.last_fetched_balance) *
          BigInt(subjectDetails.last_fetched_key_price);
      }
    }
    return portfolioValue;
  }
}

export default new SubjectKeyService();
