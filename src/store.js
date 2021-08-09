// store.js
import { createStore } from "vuex";

const store = createStore({
  state: {
    projects: {},
  },
  mutations: {
    upsertProject(state, project) {
      state.projects[project.name] = project.files;
    },
  },
  getters: {},
  actions: {},
});
export default store;
