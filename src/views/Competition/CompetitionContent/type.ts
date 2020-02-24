export { ProjectContentItemType, ProjectMemberType, ProjectTeamType }

interface ProjectContentItemType {
  title: string
  content: string[]
}

interface ProjectMemberType {
  id: string
  portrait: string
  introduce: string[]
  contribution: string[]
}

interface ProjectTeamType {
  team_name: string
  members: ProjectMemberType[]
}
