<template>
  <a-row>
    <a-col :span="12">
      <a-card
        style="width: 100%"
        :title="projectName"
        :tab-list="files"
        :active-tab-key="current"
        @tabChange="(key) => changeActive(key)"
      >
        <template #tabBarExtraContent>
          <DownloadButton :files="files" :projectName="projectName" />
        </template>
        <div v-for="file in files" :key="file.name">
          <v-ace-editor
            v-model:value="file.content"
            v-if="file.isActive"
            :lang="file.ext"
            theme="monokai"
            style="height: 600px"
            :options="{
              enableSnippets: true,
              enableLiveAutocompletion: true,
              useWorker: true,
            }"
          />
        </div>
      </a-card>
    </a-col>
    <!-- 预览 -->
    <a-col :span="12">
      <iframe style="width:100%;height:100%" :srcdoc="fullContent" />
    </a-col>
  </a-row>
</template>
<script>
import DownloadButton from "./DownloadButton.vue";
import { VAceEditor } from "vue3-ace-editor";
import axios from "axios";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/webpack-resolver";
export default {
  name: "Editor",
  components: {
    DownloadButton,
    VAceEditor,
  },
  props: {
    projectName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      files: [],
    };
  },
  methods: {
    changeActive: function(name) {
      this.files.forEach((f) => {
        f.isActive = f.name == name;
      });
    },
    ext: function(fileName) {
      var e = fileName.split(".").slice(-1)[0];
      switch (e) {
        case "md":
          e = "markdown";
          break;
        case "js":
          e = "javascript";
          break;
      }
      return e;
    },
    updateIFrame: function() {
      var contents = {};
      this.files.forEach((file) => {
        if (contents[file.ext]) {
          contents[file.ext].push(file.content);
        } else {
          contents[file.ext] = [file.content];
        }
      });
      if (contents["html"]) {
        contents["html"] = contents["html"].map((htmlfile) => {
          var newHtml = htmlfile;
          this.files.forEach((file) => {
            switch (file.ext) {
              case "css":
                var cssReg = new RegExp(
                  "<\\s*link.*" + file.name + ".*/\\s*(link)*\\s*>",
                  "igm"
                );
                newHtml = newHtml.replace(
                  cssReg,
                  "<style>" + file.content + "</style>"
                );
                break;
              case "javascript":
                var jsReg = new RegExp(
                  "<\\s*script.*" + file.name + ".*/\\s*(script)*\\s*>",
                  "igm"
                );
                newHtml = newHtml.replace(
                  jsReg,
                  "<script>" + file.content + "</" + "script>"
                );
                break;
            }
          });
          return newHtml;
        });
      }
      return contents["html"] ? contents["html"].join("") : "";
    },
    getFilesFromAPI() {
      this.files = [];
      var url =
        "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects/" +
        this.projectName;
      axios
        .get(url)
        .then((response) => {
          console.log("获取" + this.projectName + "文件一览");
          response.data.forEach((record) => {
            var ext = this.ext(record.name);
            if (["html", "javascript", "css"].indexOf(ext) > -1) {
              axios.get(record.download_url).then((res) => {
                var file = {
                  content: res.data,
                  name: record.name,
                  ext: ext,
                  id: record.sha,
                  isActive: false,
                  key: record.name,
                  tab: record.name,
                };
                if (ext == "html") {
                  file.isActive = true;
                  this.files.splice(0, 0, file);
                } else {
                  this.files.push(file);
                }
                console.log("获取" + file.name + "文件内容");
              });
            }
          });
        })
        .catch((e) => {
          console.error(e);
        });
    },
    loadProject: function(pjName) {
      const newProject = this.$store.getters.getProjectByName(pjName);
      if (!newProject || !newProject.files) {
        this.getFilesFromAPI();
      } else {
        this.files = newProject.files;
      }
    },
  },
  mounted: function() {
    this.loadProject(this.projectName);
  },
  beforeUnmount: function() {
    this.$store.commit("upsertProject", {
      name: this.projectName,
      files: this.files,
    });
  },
  computed: {
    current() {
      try {
        return this.files.filter((f) => f.isActive)[0].name;
      } catch (e) {
        return "";
      }
    },
    fullContent() {
      return this.updateIFrame();
    },
  },
  watch: {
    projectName: function(newVal, oldVal) {
      // 画面上的修改在切换project时要存下来
      const oldProject = {
        name: oldVal,
        files: this.files,
      };
      this.$store.commit("upsertProject", oldProject);
      this.loadProject(newVal);
    },
  },
};
</script>
