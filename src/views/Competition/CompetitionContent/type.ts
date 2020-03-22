export { ProjectContentItemType, ProjectMemberType, ProjectTeamType }

interface ProjectContentItemType {
  title: string
  content: string[]
}

interface ProjectMemberType {
  PId: string
  userId: string
  index?: number
  headUrl: string
  introduce: string[]
  contribution: string[]
}

type ProjectTeamType = ProjectMemberType[]
// interface ProjectTeamType {
//   members: ProjectMemberType[]
// }
