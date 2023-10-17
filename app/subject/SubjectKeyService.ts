import { Supabase } from "common-dapp-module";
import IglooSubjectContract from "../contracts/IglooSubjectContract.js";
import SignedUserManager from "../user/SignedUserManager.js";
import SubjectKeyBalanceCacher from "./SubjectKeyBalanceCacher.js";

class SubjectKeyService {
  public async buyKey(subject: string, price: bigint): Promise<void> {
    await IglooSubjectContract.buyKeys(subject, 1n, price);

    Supabase.client.functions.invoke("track-subject-events");
    Supabase.client.functions.invoke("track-subject-price-and-balance", {
      body: { subjects: [subject] },
    });

    SubjectKeyBalanceCacher.increaseKeyBalanceInstantly(
      SignedUserManager.userId!,
      subject,
    );
  }
}

export default new SubjectKeyService();
