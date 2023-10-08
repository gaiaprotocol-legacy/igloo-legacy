export type Emoji = string;

export interface UploadedFile {
  url: string;
  thumbnailURL?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}
