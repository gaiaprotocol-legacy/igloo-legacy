import { DomNode } from "common-dapp-module";

export default class PostForm extends DomNode {
  private waitingUploadFiles: File[] = [];

  constructor() {
    super(".post-form");
  }

  private addUploadFile(file: File) {
    //TODO:
  }

  private deleteUploadFile(index: number) {
    //TODO:
  }
}
