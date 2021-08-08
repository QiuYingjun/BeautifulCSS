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
      <a
        :class="
          (project.name == this.currentProjectName ? 'active ' : '') +
            'border-bottom list-group-item list-group-item-action lh-tight'
        "
        href="#"
        :aria-current="project.name == this.currentProjectName"
        v-for="project in projects"
        :key="project.name"
      >
        <div class="d-flex w-100 justify-content-between">
          <div class="col-8">
            <strong class="mb-1">{{ project.name }}</strong>
            <div class="mb-1 small ">
              {{ project.description }}
            </div>
          </div>
          <div class="col-4">
            <img class="img-thumbnail float-right" :src="project.image_url" />
          </div>
        </div>
      </a>
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
  methods: {},
  mounted: function() {
    // prjects目录下所有问题的sha
    //
    axios
      .get(
        "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects"
      )
      .then((response) => {
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
                Base64.decode(response.data.content).substring(0, 55) + "...";
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
