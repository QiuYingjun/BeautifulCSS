<template>
  <a-list
    item-layout="vertical"
    size="small"
    :data-source="projects"
    :pagination="{ pageSize: 5, position: 'top' }"
  >
    <template #renderItem="{ item }">
      <router-link :to="'/EditPanel/' + item.name" active-class="active">
        <a-card hoverable width="280" size="small">
          <a-row>
            <a-col :span="8">
              <img
                v-if="item.image_url"
                class="preview"
                alt="example"
                :src="item.image_url"
              />
              <img v-else class="preview" alt="example" :src="logo" />
            </a-col>
            <a-col :span="16" style="padding-left:10px">
              <a-card-meta :title="item.name" :description="item.description" />
            </a-col>
          </a-row>
        </a-card>
      </router-link>
    </template>
  </a-list>
</template>
<script>
import axios from "axios";
import { Base64 } from "js-base64";
import logo from "../assets/logo.png";
export default {
  name: "Sidebar",
  data() {
    return {
      logo: logo,
    };
  },
  props: {},
  mounted() {
    if (this.projects.length == 0) {
      this.getProjectListFromAPI();
    }
  },
  computed: {
    projects() {
      return this.$store.getters.getProjectSummary();
    },
  },
  methods: {
    getProjectListFromAPI: function() {
      axios
        .get(
          "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects"
        )
        .then((p_response) => {
          console.log("获取工程一览");
          p_response.data.forEach((p_record) => {
            axios
              .get(
                "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects/" +
                  p_record.name +
                  "/readme.md"
              )
              .then((f_response) => {
                var project = {};
                project.name = p_record.name;
                project.description = "";
                // 去掉标题后，取第一行为说明文本
                for (const s of Base64.decode(f_response.data.content)
                  .replace(/^#.*/, "")
                  .split("\n")) {
                  if (s != "" && project.description == "") {
                    project.description = s;
                    break;
                  }
                }
                project.image_url =
                  "https://raw.githubusercontent.com/QiuYingjun/BeautifulCSS/main/projects/" +
                  project.name +
                  "/readme.png";
                this.$store.commit("upsertProject", project);
              });
          });
        });
    },
  },
};
</script>
<style scoped>
.active div.ant-card {
  border-color: #369eff;
}
.preview {
  width: 90px;
  height: 90px;
}
</style>
