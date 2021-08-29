<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal">
    <a-menu-item key="Home">
      <HomeOutlined />
      <router-link to="/"> Home </router-link>
    </a-menu-item>
    <a-menu-item key="EditPanel">
      <ExperimentOutlined />
      <router-link to="/EditPanel"> Panel </router-link>
    </a-menu-item>
  </a-menu>
</template>
<script lang="ts">
import { ExperimentOutlined, HomeOutlined } from "@ant-design/icons-vue";

export default {
  data() {
    return {
      current: ["Home"],
    };
  },
  components: {
    ExperimentOutlined,
    HomeOutlined,
  },
  watch: {
    $route(to, from) {
      console.log(to.fullPath, from.fullPath);
      if (to.fullPath == "/") {
        this.current[0] = "Home";
      } else if (to.fullPath.indexOf("EditPanel") > -1) {
        this.current[0] = "EditPanel";
      }
    },
  },
};
</script>
<style lang="css">
.ant-layout-header {
  padding: 0 !important;
  background: rgba(0, 0, 0, 0);
}
</style>
