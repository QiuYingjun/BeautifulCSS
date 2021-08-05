<template>
  <v-ace-editor
    v-model:value="htmlCode"
    @init="editorInit"
    lang="html"
    theme="monokai"
    style="height: 300px;width:30%;"
  />
  <v-ace-editor
    v-model:value="cssCode"
    @init="editorInit"
    lang="css"
    theme="monokai"
    style="height: 300px;width:30%;"
  />
  <v-ace-editor
    v-model:value="javascriptCode"
    @init="editorInit"
    lang="javascript"
    theme="monokai"
    style="height: 300px;width:30%;"
  />
  <Preview
    :htmlCode="htmlCode"
    :cssCode="cssCode"
    :javascriptCode="javascriptCode"
  />
</template>

<script>
import Preview from "./Preview.vue";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

export default {
  name: "Panel",
  data() {
    return {
      htmlCode: "",
      cssCode: "",
      javascriptCode: "",
    };
  },
  methods: {
    show() {
      alert(this.htmlCode);
    },
    editorInit() {},
  },
  components: {
    Preview,
    VAceEditor,
  },
};
</script>
