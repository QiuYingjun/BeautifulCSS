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
                alt="example"
                style="width:100%;height:100%"
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
    currentProjectName: {
      type: String,
      default: "",
    },
  },
  methods: {
    changeProject: function(pjName) {
      console.log(pjName);
    },
  },
  mounted: function() {
    console.log(this.currentProjectName);
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
              project.description =
                Base64.decode(response.data.content)
                  .replace(/^#.*/, "")
                  .substring(0, 60) + "...";
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
      .then(() => {
        for (var i = 0; i < 6; i++) {
          this.projects.push({
            name: "fdafdsaf" + i,
            description: "adfafdsfdsafdsafdsa",
            image_url: logo,
          });
        }
      });
  },
};
</script>
<style scoped>
.active div.ant-card {
  border-color: #369eff;
}
</style>
