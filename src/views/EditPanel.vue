<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2">
        <Sidebar :currentProjectName="projectName" />
      </div>
      <div class="col">
        <div class="row">
          <h2 class="text-left">{{ projectName }}</h2>
        </div>
        <router-view> </router-view>
      </div>
    </div>
  </div>
</template>

<script>
// import Editor from "@/components/Editor.vue";
import Sidebar from "@/components/Sidebar.vue";
// import { useRoute } from "vue-router";
export default {
  name: "EditPanel",
  components: {
    // Editor,
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
