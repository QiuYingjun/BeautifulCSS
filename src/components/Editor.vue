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
      <iframe style="width: 100%; height: 100%" :srcdoc="fullContent" />
    </a-col>
  </a-row>
</template>
<script>
import DownloadButton from "./DownloadButton.vue";
import { VAceEditor } from "vue3-ace-editor";

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
    return {};
  },
  methods: {
    changeActive: function (name) {
      this.files.forEach((f) => {
        f.isActive = f.name == name;
      });
    },
    updateIFrame: function () {
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
                newHtml = newHtml.replace(cssReg, "<style>" + file.content + "</style>");
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
    loadProject: function (pjName) {
      const newProject = this.$store.getters.getProjectByName(pjName);
      if (!newProject || !newProject.files) {
        this.$store.dispatch("getFilesFromAPI", pjName);
      }
    },
  },
  mounted: function () {
    this.loadProject(this.projectName);
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
    files() {
      var p = this.$store.getters.getProjectByName(this.projectName);
      if (p && p.files) {
        return p.files;
      } else {
        this.$store.dispatch("getFilesFromAPI", this.projectName);
        return [];
      }
    },
  },
  watch: {
    projectName: function (newVal, oldVal) {
      console.log(oldVal);
      this.loadProject(newVal);
    },
  },
};
</script>
