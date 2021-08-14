<template>
  <a-menu v-model:selectedKeys="Home" mode="horizontal">
    <a-menu-item key="Home">
      <HomeOutlined />
      <router-link to="/BeautifulCSS">
        Home
      </router-link>
    </a-menu-item>
    <a-menu-item key="EditPanel">
      <ExperimentOutlined />
      <router-link to="/BeautifulCSS/EditPanel">
        Panel
      </router-link>
    </a-menu-item>
  </a-menu>
</template>
<script lang="ts">
import { ExperimentOutlined, HomeOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    ExperimentOutlined,
    HomeOutlined,
  },
};
</script>
<style lang="css">
.ant-layout-header {
  padding: 0 !important;
  background: rgba(0, 0, 0, 0);
}
</style>
