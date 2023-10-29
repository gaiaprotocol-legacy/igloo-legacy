import { Supabase } from "common-app-module";
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
}

export default new SubjectKeyService();
