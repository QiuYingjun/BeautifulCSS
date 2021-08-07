<template>
  <div class="container">
    <div class="row">
      <h1>{{ this.projectName }}</h1>

      <div class="col">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
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
        <div class="tab-content" id="myTabContent">
          <div
            :class="'tab-pane ' + (file.isActive ? 'fade show active' : '')"
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
      <div class="col">
        <iframe
          id="preview"
          style="top: 0;background: #ccc; width:100%; height:666px;"
          class="edit-area"
          frameborder="0"
          :srcdoc="fullContent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/webpack-resolver";
export default {
  name: "Panel",
  components: {
    VAceEditor,
  },
  props: {
    projectName: {
      type: String,
      default: "Glass Card",
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
      console.log(contents);
      this.fullContent =
        "<!DOCTYPE html>" +
        "<html><head><style >" +
        (contents["css"] ? contents["css"].join("") : "") +
        "</style></head><body>" +
        (contents["html"] ? contents["html"].join("") : "") +
        "<script>" +
        (contents["js"] ? contents["js"].join("") : "") +
        "</" +
        "script></body></html>";
    },
  },
  mounted: function() {
    const axios = require("axios");
    var url =
      "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects/" +
      this.projectName;
    axios
      .get(url)
      .then((response) => {
        response.data.forEach((record) => {
          var ext = this.ext(record.name);
          if (["html", "js", "css"].indexOf(ext) > -1) {
            axios.get(record.download_url).then((res) => {
              var file = {};
              file.content = res.data;
              file.name = record.name;
              file.ext = this.ext(file.name);
              file.id = record.sha;
              file.isActive = this.files.length == 0;
              this.files.push(file);
              console.log(this.files);
            });
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(this.files);
  },
  updated: function() {
    this.updateIFrame();
  },
};
</script>
<style>
.tinytabs .tabs {
  margin-left: 15px;
  display: flex;
  flex-flow: row wrap;
}
.tinytabs .tabs .tab .close {
  padding-left: 5px;
}
.tinytabs .tabs .tab {
  margin: 0 3px 0 0;
  background: #e1e1e1;
  display: block;
  padding: 6px 15px;
  text-decoration: none;
  color: #666;
  font-weight: bold;
  border-radius: 3px 3px 0 0;
}
.tinytabs .section {
  background: #f1f1f1;
  overflow: hidden;
  padding: 15px;
  clear: both;
  border-radius: 3px;
}
.tinytabs .tab.sel {
  background: #f1f1f1;
  color: #333;
  text-shadow: none;
}
</style>
