<template>
  <div class="card-wrapper">
    <div class="team-photo"
      :style="{backgroundImage: `url(${project_data.imgUrl})`}"></div>
    <div class="project-name">
      {{ project_data.PName }}
    </div>
    <div class="project-summary">
      {{ project_data.PSummary }}
    </div>
    <div class="team-name">
      {{ project_data.TName }}
    </div>
    <div class="team-members">
      {{ strTMembers(project_data.TMembers) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import { ProjectDataType } from "@/utils/interface"

@Component({
  name: "ProjectCard"
})
export default class extends Vue {
  @Prop({ required: true, default: {} }) project_data!: ProjectDataType
  strTMembers(TMembers: any[]): string {
    let names: string[] = TMembers.map(member => member.name)
    return names.join("、")
  }
}
</script>

<style lang="scss" scoped>
@import "./ProjectCard.scss";
</style>
