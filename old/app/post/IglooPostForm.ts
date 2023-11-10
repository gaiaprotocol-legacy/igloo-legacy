import { PostForm } from "sofi-module";

export default class IglooPostForm extends PostForm {
  constructor(authorProfileImage: string, focus: boolean = false) {
    super(authorProfileImage, focus);
  }

  protected post(message: string, files: File[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
