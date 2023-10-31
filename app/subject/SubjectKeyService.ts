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
    const { data, error } = await Supabase.client.rpc("get_portfolio_value", {
      param_wallet_address: walletAddress,
    });
    if (error) throw error;
    return BigInt(data);
  }
}

export default new SubjectKeyService();
