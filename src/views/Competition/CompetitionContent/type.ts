// export { ProjectContentItemType, ProjectMemberType, ProjectTeamType }

export interface PjContentItemType {
  PId: string
  index: number
  title: string
  content: string | string[]
  time: number
  show?: boolean
}

export interface ProjectMemberType {
  PId: string
  userId: string
  index?: number
  headUrl: string
  introduce: string[]
  contribution: string[]
}

export type ProjectTeamType = ProjectMemberType[]
// interface ProjectTeamType {
//   members: ProjectMemberType[]
// }
