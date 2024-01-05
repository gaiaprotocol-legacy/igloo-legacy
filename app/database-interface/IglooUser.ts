import { SoFiUserPublic } from "@common-module/social";

export default interface IglooUser extends SoFiUserPublic {
  total_earned_trading_fees: string;
}
