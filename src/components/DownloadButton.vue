<template>
  <button type="button" class=" btn btn-outline-dark" @click="download">
    <i class="bi bi-download"></i>
  </button>
</template>
<script>
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default {
  name: "DownloadButton",
  data() {
    return {};
  },
  props: {
    files: [],
    projectName: {
      type: String,
      default: "example",
    },
  },
  methods: {
    download() {
      var zip = new JSZip();
      this.files.forEach((file) => {
        zip.file(file.name, file.content);
      });
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, this.projectName + ".zip");
      });
    },
  },
};
</script>
