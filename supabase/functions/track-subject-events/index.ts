import { ethers } from "https://esm.sh/ethers@6.7.0";
import IglooSubjectContract from "../_shared/contracts/IglooSubjectContract.ts";
import { serveWithOptions } from "../_shared/cors.ts";
import supabase from "../_shared/supabase.ts";

const provider = new ethers.JsonRpcProvider(Deno.env.get("AVAX_RPC")!);
const signer = new ethers.JsonRpcSigner(provider, ethers.ZeroAddress);
const subjectContract = new IglooSubjectContract(signer);

serveWithOptions(async () => {
  const { data, error: fetchEventBlockError } = await supabase.from(
    "tracked_event_blocks",
  ).select()
    .eq("contract_type", "subject");
  if (fetchEventBlockError) throw fetchEventBlockError;

  let toBlock = (data?.[0]?.block_number ??
    parseInt(Deno.env.get("IGLOO_SUBJECT_DEPLOY_BLOCK")!)) + 1000;

  const currentBlock = await provider.getBlockNumber();
  if (toBlock > currentBlock) toBlock = currentBlock;

  const events = await subjectContract.getTradeEvents(toBlock - 2000, toBlock);
  for (const event of events) {
    const { error: saveEventError } = await supabase
      .from("subject_contract_events")
      .upsert({
        block_number: event.blockNumber,
        log_index: event.index,
        args: event.args.map((arg) => arg.toString()),
        wallet_address: event.args[0],
        subject: event.args[1],
      });
    if (saveEventError) throw saveEventError;
  }

  const { error: saveEventBlockError } = await supabase.from(
    "tracked_event_blocks",
  ).upsert({
    contract_type: "subject",
    block_number: toBlock,
    updated_at: new Date().toISOString(),
  });
  if (saveEventBlockError) throw saveEventBlockError;
});
