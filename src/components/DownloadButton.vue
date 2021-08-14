<template>
  <a-button type="primary" @click="download" shape="round" :size="size">
    <template #icon>
      <DownloadOutlined />
    </template>
  </a-button>
</template>
<script>
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { DownloadOutlined } from "@ant-design/icons-vue";
export default {
  name: "DownloadButton",
  components: {
    DownloadOutlined,
  },
  data() {
    return {};
  },
  props: {
    files: Array,
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
