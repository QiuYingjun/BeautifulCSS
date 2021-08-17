<template>
  <a-list
    item-layout="vertical"
    size="small"
    :data-source="projects"
    :pagination="{ pageSize: 5, position: 'top' }"
  >
    <template #renderItem="{ item }">
      <router-link
        :to="'/BeautifulCSS/EditPanel/' + item.name"
        active-class="active"
      >
        <a-card hoverable width="280" size="small">
          <a-row>
            <a-col :span="8">
              <img
                class="preview"
                alt="example"
                :src="item.image_url"
              />
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
      projects: [],
    };
  },
  props: {
  },
  methods: {
  },
  mounted: function() {
    axios
      .get(
        "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects"
      )
      .then((response) => {
        console.log("获取工程一览");
        response.data.forEach((record) => {
          this.projects.push({
            name: record.name,
            id: record.sha,
          });
        });
        return this.projects;
      })
      .then((projects) => {
        projects.forEach((project) => {
          axios
            .get(
              "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects/" +
                project.name +
                "/readme.md"
            )
            .then((response) => {
              project.description = "";
              // 去掉标题后，取第一行为说明文本
              for (const s of Base64.decode(response.data.content)
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
            })
            .catch(() => {
              project.description = "没有说明";
              project.image_url = logo;
            });
        });
      })
  },
};
</script>
<style scoped>
.active div.ant-card {
  border-color: #369eff;
}
.preview {
  width:90px;
  height:90px;
}
</style>
