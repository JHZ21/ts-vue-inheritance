/* */
export interface CommentInfoType {
  portraitUrl: string;
  username: string;
  content: string;
  timeStamp: number;
}

export interface NavRow {
  label: string;
  aData: any[];
}

export interface CardData {
  img_url: string;
  title: string;
  id: number;
  readVolume: number;
  uploader: string;
  timeStamp: number;
}

export interface LinkElement {
  rel: string;
  href: string;
}
