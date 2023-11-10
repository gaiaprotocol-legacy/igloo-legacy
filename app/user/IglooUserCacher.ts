import { TempSoFiUserCacher } from "sofi-module";
import SoFiUserPublic from "sofi-module/lib/database-interface/SoFiUserPublic.js";

class IglooUserCacher extends TempSoFiUserCacher<SoFiUserPublic> {}

export default new IglooUserCacher();
