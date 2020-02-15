<template>
  <div class="competition-box">
    <div class="competition-content">
      <div class="project-name">大金欧发掘到酒店房间啊</div>
      <section class="project-content">
        <div class="project-content-item">
          <div class="item-title">技术栈</div>
          <div class="item-content">
            <p>Vue</p>
            <p>Vue-router</p>
            <p>Vuex</p>
            <p>Mockjs</p>
            <p>SCSS</p>
            <p>Typescript</p>
          </div>
        </div>
        <div class="project-content-item">
          <div class="item-title">技术栈</div>
          <div class="item-content">
            <p>Vue</p>
            <p>Vue-router</p>
            <p>Vuex</p>
            <p>Mockjs</p>
            <p>SCSS</p>
            <p>Typescript</p>
          </div>
        </div>
        <div class="project-content-item">
          <div class="item-title">技术栈</div>
          <div class="item-content">
            <p>Vue</p>
            <p>Vue-router</p>
            <p>Vuex</p>
            <p>Mockjs</p>
            <p>SCSS</p>
            <p>Typescript</p>
          </div>
        </div>
      </section>
      <section class="project-team">
        <div class="team-name">打发打发dead</div>
        <div class="members-box">
          <div class="team-member">
            <div class="member-info">
              <div class="portrait-wrapper">
                <div class="portrait"></div>
              </div>
              <div class="introduce">
                <p>江小白</p>
                <p>2017级</p>
                <p>Web前端攻城狮</p>
                <p>熟悉Vue全家桶</p>
                <p>熟悉SCSS</p>
                <p>2017级</p>
                <p>Web前端攻城狮</p>
                <p>熟悉Vue全家桶</p>
                <p>熟悉SCSS</p>
                <p>熟悉Vue全家桶</p>
                <p>熟悉SCSS</p>
                <p>2017级</p>
                <p>Web前端攻城狮</p>
                <p>熟悉Vue全家桶</p>
                <p>熟悉SCSS</p>
              </div>
            </div>
            <div class="member-contribution">
              <p>打法的非法，大风啊我发</p>
              <p>打法的非法，大风啊我发，打法二分</p>
              <p>打法的非法，阿飞，啊额，嗯阿发发的，大非法</p>
              <p>打法的非法，大风啊我发，打法二分</p>
              <p>打法的非法，阿飞，啊额，嗯阿发发的，大非法</p>
            </div>
          </div>
          <div class="team-member">
            <div class="member-info">
              <div class="portrait-wrapper">
                <div class="portrait"></div>
              </div>
              <div class="introduce">
                <p>江小白</p>
                <p>2017级</p>
                <p>Web前端攻城狮</p>
                <p>熟悉Vue全家桶</p>
                <p>熟悉SCSS</p>
              </div>
            </div>
            <div class="member-contribution">
              <p>打法的非法，大风啊我发</p>
              <p>打法的非法，大风啊我发，打法二分</p>
              <p>打法的非法，阿飞，啊额，嗯阿发发的，大非法</p>
              <p>打法的非法</p>
              <p>打法的非法，大风啊我发</p>
              <p>打法的非法，大风啊我发，打法二分</p>
              <p>打法的非法，阿飞，啊额，嗯阿发发的，大非法</p>
              <p>打法的非法</p>
            </div>
          </div>
          <div class="team-member">
            <div class="member-info">
              <div class="portrait-wrapper">
                <div class="portrait"></div>
              </div>
              <div class="introduce">
                <p>江小白</p>
                <p>2017级</p>
                <p>Web前端攻城狮</p>
                <p>熟悉Vue全家桶</p>
                <p>熟悉SCSS</p>
              </div>
            </div>
            <div class="member-contribution">
              <p>打法的非法，大风啊我发</p>
              <p>打法的非法，大风啊我发，打法二分</p>
              <p>打法的非法，阿飞，啊额，嗯阿发发的，大非法</p>
              <p>打法的非法</p>
              <p>打法的非法，大风啊我发</p>
              <p>打法的非法，大风啊我发，打法二分</p>
              <p>打法的非法，阿飞，啊额，嗯阿发发的，大非法</p>
              <p>打法的非法</p>
            </div>
          </div>
        </div>
      </section>
      <section class="project-code">
        <div class="code-title">项目</div>
        <div class="code-content">
          <el-steps
            :active="2"
            align-center
          >
            <el-step
              title="步骤1"
              description="这是一段很长很长很长的描述性文字"
            ></el-step>
            <el-step
              title="步骤2"
              description="这是一段很长很长很长的描述性文字"
            ></el-step>
            <el-step
              title="步骤3"
              description="这是一段很长很长很长的描述性文字"
            ></el-step>
            <el-step
              title="步骤4"
              description="这是一段很长很长很长的描述性文字"
            ></el-step>
          </el-steps>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component({
  name: "CompetitionContent"
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
@import "./CompetitionContent.scss";
</style>
