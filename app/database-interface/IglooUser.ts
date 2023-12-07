import { SoFiUserPublic } from "sofi-module";

export default interface IglooUser extends SoFiUserPublic {
  total_earned_trading_fees: string;
}
