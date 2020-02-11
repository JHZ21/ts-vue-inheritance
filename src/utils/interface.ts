/* */

export interface ProjectDataType {
  PName: string;
  PSummary: string;
  TName: string;
  TMembers: string[];
  id: number;
  url?: string;
}

export type NestedCardList = CardData[][][][];

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
