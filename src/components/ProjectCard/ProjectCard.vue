<template>
  <div class="card-wrapper">
    <div class="team-photo"></div>
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
      {{ project_data.TMembers.join("、") }}
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
}
</script>

<style lang="scss" scoped>
@import "./ProjectCard.scss";
</style>
