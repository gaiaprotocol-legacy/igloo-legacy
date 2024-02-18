import { ethers } from "https://esm.sh/ethers@6.7.0";
import IglooSubjectAggregatorContract from "../_shared/contracts/IglooSubjectAggregatorContract.ts";
import { serveWithOptions } from "../_shared/cors.ts";
import supabase, { getSignedUser } from "../_shared/supabase.ts";
import { getUserWalletAddress } from "../_shared/user.ts";

const provider = new ethers.JsonRpcProvider(Deno.env.get("AVAX_RPC")!);
const signer = new ethers.JsonRpcSigner(provider, ethers.ZeroAddress);
const aggregatorContract = new IglooSubjectAggregatorContract(signer);

serveWithOptions(async (req) => {
  const { subjects } = await req.json();
  if (!subjects) throw new Error("Missing subjects");

  const user = await getSignedUser(req);
  if (!user) throw new Error("Unauthorized");

  const walletAddress = await getUserWalletAddress(user.id);
  if (!walletAddress) throw new Error("No wallet address");

  const [prices, balances] = await Promise.all([
    aggregatorContract.getBulkKeyPrices(subjects),
    aggregatorContract.getBulkKeyBalances(walletAddress, subjects),
  ]);

  const priceDataSet = subjects.map((subject: string, index: number) => ({
    subject: ethers.getAddress(subject),
    last_fetched_key_price: prices[index].toString(),
  }));

  const balanceDataSet = subjects.map((subject: string, index: number) => ({
    subject: ethers.getAddress(subject),
    wallet_address: walletAddress,
    last_fetched_balance: Number(balances[index]),
  }));

  const [{ error: detailError }, { error: holderError }] = await Promise.all([
    supabase.from("subject_details").upsert(priceDataSet),
    supabase.from("subject_key_holders").upsert(balanceDataSet),
  ]);

  if (detailError) throw detailError;
  if (holderError) throw holderError;
});
