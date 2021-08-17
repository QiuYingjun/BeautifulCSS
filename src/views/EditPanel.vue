<template>
  <a-layout :has-sider="true">
    <a-layout-sider :theme="'light'" width="320">
      <Sidebar />
    </a-layout-sider>
    <a-layout-content>
      <router-view> </router-view>
    </a-layout-content>
  </a-layout>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
export default {
  name: "EditPanel",
  components: {
    Sidebar,
  },
  props: {
    projectName: {
      type: String,
      default: "Glass Card",
    },
  },
  data() {
    return {};
  },
  methods: {},
  mounted: function() {},
};
</script>
