import { Router } from "@common-module/app";
import { Author, ChatMessageInteractions } from "@common-module/social";

class IglooChatMessageInteractions implements ChatMessageInteractions {
  public openAuthorProfile(author: Author) {
    Router.go(`/${author.x_username}`, undefined, author);
  }
}

export default new IglooChatMessageInteractions();
