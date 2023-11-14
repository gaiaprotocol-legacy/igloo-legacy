import { TempPostCacher } from "sofi-module";
import IglooPost from "../database-interface/IglooPost.js";

class IglooTempPostCacher extends TempPostCacher<IglooPost> {
}

export default new IglooTempPostCacher();
