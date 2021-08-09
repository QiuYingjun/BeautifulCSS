<template>
  <div class="row">
    <!--编辑器 -->
    <div class="col">
      <div class="row justify-content-between">
        <ul class="nav nav-tabs col" id="myTab" role="tablist">
          <li
            class="nav-item"
            role="presentation"
            v-for="file in files"
            :key="file.id"
          >
            <button
              :class="'nav-link ' + (file.isActive ? 'active' : '')"
              :id="file.name + '-tab'"
              data-bs-toggle="tab"
              :data-bs-target="'#' + file.name"
              type="button"
              role="tab"
              :aria-controls="file.name"
              aria-selected="true"
              @click="activateTab(file.id)"
            >
              {{ file.name }}
            </button>
          </li>
        </ul>
        <div class="col-1">
          <DownloadButton :files="files" :projectName="projectName" />
        </div>
      </div>
      <div class="row tab-content">
        <div
          :class="'px-0 tab-pane ' + (file.isActive ? 'show active' : '')"
          :id="file.name"
          role="tabpanel"
          :aria-labelledby="file.name + '-tab'"
          v-for="file in files"
          :key="file.id"
        >
          <v-ace-editor
            v-model:value="file.content"
            :lang="ext(file.name)"
            theme="monokai"
            style="height: 600px"
            :options="options"
            @init="editorInit"
          />
        </div>
      </div>
    </div>
    <!-- 预览 -->
    <div class="col">
      <iframe class="w-100 h-100 border" :srcdoc="fullContent" />
    </div>
  </div>
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
      fullContent: "",
      options: {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        useWorker: true,
      },
    };
  },
  methods: {
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
    activateTab(fileId) {
      this.files.forEach((file) => {
        file.isActive = file.id == fileId;
      });
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
      this.fullContent = contents["html"] ? contents["html"].join("") : "";
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
  },
  mounted: function() {
    this.getFilesFromAPI();
  },
  updated: function() {
    this.updateIFrame();
  },
  watch: {
    projectName: function(newVal, oldVal) {
      const project = {
        name: oldVal,
        files: this.files,
      };
      this.$store.commit("upsertProject", project);
      this.files = this.$store.state.projects[newVal];
      if (!this.files) {
        this.getFilesFromAPI();
      }
    },
  },
};
</script>
