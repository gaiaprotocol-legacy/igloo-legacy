import {
  SoFiUserPublic,
  SoFiUserPublicSelectQuery,
  SoFiUserService,
} from "sofi-module";

class IglooUserService extends SoFiUserService<SoFiUserPublic> {
  constructor() {
    super("users_public", SoFiUserPublicSelectQuery, 50);
  }
}

export default new IglooUserService();
