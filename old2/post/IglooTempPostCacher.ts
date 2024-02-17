import { TempPostCacher } from "@common-module/social";
import IglooPost from "../database-interface/IglooPost.js";

class IglooTempPostCacher extends TempPostCacher<IglooPost> {
}

export default new IglooTempPostCacher();
