<template>
  <a-list
    item-layout="vertical"
    size="small"
    :data-source="projects"
    :pagination="{ pageSize: 5, position: 'top' }"
  >
    <template #renderItem="{ item }">
      <router-link :to="'/EditPanel/' + item.name" active-class="active">
        <a-card hoverable width="280" size="small">
          <a-row>
            <a-col :span="8">
              <img
                v-if="item.image_url"
                class="preview"
                alt="example"
                :src="item.image_url"
              />
              <img v-else class="preview" alt="example" :src="logo" />
            </a-col>
            <a-col :span="16" style="padding-left: 10px">
              <a-card-meta :title="item.name" :description="item.description" />
            </a-col>
          </a-row>
        </a-card>
      </router-link>
    </template>
  </a-list>
</template>
<script>
import logo from "../assets/logo.png";
export default {
  name: "Sidebar",
  data() {
    return {
      logo: logo,
    };
  },
  props: {},
  mounted() {
    if (this.$store.state.projects.length == 0) {
      this.$store.dispatch("getProjectListFromAPI");
    }
  },
  computed: {
    projects() {
      return this.$store.getters.getProjectSummary();
    },
  },
  methods: {},
};
</script>
<style scoped>
.active div.ant-card {
  border-color: #369eff;
}
.preview {
  width: 90px;
  height: 90px;
}
</style>
