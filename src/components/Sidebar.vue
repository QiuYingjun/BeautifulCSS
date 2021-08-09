<template>
  <div>
    <a
      class="d-flex align-items-left p-3 link-dark text-decoration-none border-bottom"
      href="https://github.com/QiuYingjun/BeautifulCSS"
      target="blank"
    >
      <h1 class="text-left">BeautifulCSS</h1>
    </a>
    <div class="list-group" style="overflow:auto;height:800px">
      <router-link
        v-for="project in projects"
        :key="project.name"
        :to="'/editpanel/' + project.name"
        tag="a"
        class="border-bottom list-group-item list-group-item-action lh-tight"
        active-class="active"
      >
        <div class="d-flex w-100 justify-content-between">
          <div class="col-8">
            <strong class="mb-1">{{ project.name }}</strong>
            <h6 class="mb-1 small pe-1">{{ project.description }}</h6>
          </div>
          <div class="col-4">
            <img class="img-thumbnail float-right" :src="project.image_url" />
          </div>
        </div>
      </router-link>
    </div>
  </div>
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
                  .substring(0, 50) + "...";
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
img {
  width: 80px;
  height: 80px;
}
</style>
