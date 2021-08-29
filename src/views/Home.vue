<!-- home -->
<template>
  <div class="home">
    <a-carousel autoplay>
      <div class="one" v-for="p in projects" :key="p.name">
        <router-link :to="'/EditPanel/' + p.name">
          <h3>{{ p.name }}</h3>
          <img :src="p.image_url" />
        </router-link>
      </div>
    </a-carousel>
  </div>
</template>
<style scoped>
div.one {
  height: 800px;
  text-align: center;
}
div.one img {
  height: 100%;
  display: inline-block;
}
</style>
<script>
export default {
  name: "Home",
  mounted() {
    if (this.$store.state.projects.length == 0) {
      this.$store.dispatch("getProjectListFromAPI");
    }
  },
  computed: {
    projects() {
      if (this.$store.state.projects.length < 5) {
        return this.$store.state.projects;
      } else {
        return this.$store.state.projects.slice(0, 4);
      }
    },
  },
};
</script>
