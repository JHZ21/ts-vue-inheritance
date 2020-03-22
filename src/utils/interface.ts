/* */

export type UpdateStoreDataType = {
  (
    updateDataApi: Function,
    params: any,
    localKey: string,
    localProp: string
  ): any
}

export type GetDataType = {
  (
    updateData: Function,
    params: any,
    localKey: string,
    max_minute?: number
  ): any
}
export interface ReadType {
  dailyRead: {
    oldRead: string[]
    timeStamp: number
  }
  sign: string
  newRead: string[]
}
export interface UserInfoType {
  isLogin: boolean
  name: string
  headUrl: string
  roles: string[]
}

export interface StepDataType {
  // title: string
  deadline: string
  description: string
}
export type StepsDataType = StepDataType[]

export interface StepsObjType {
  planName: string
  stepsData: StepsDataType
  index?: number
  activeNum: number
  pleanId: number
  master: {
    userId: string
  }
}

export interface ProjectDataType {
  PName: string
  PSummary: string
  TName: string
  TMembers: string[]
  PId: number
  url?: string
}

export type NestedCardList = CardData[][][][]

export interface CommentInfoType {
  portraitUrl: string
  username: string
  content: string
  timeStamp: number
}

export interface NavRow {
  label: string
  aData: any[]
}

export interface CardData {
  img_url: string
  title: string
  id: number
  readVolume: number
  uploader: string
  timeStamp: number
}

export interface LinkElement {
  rel: string
  href: string
}
