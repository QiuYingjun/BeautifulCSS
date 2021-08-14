// store.js
import { createStore } from "vuex";

const store = createStore({
  state: {
    projects: [],
  },
  mutations: {
    upsertProject(state, project) {
      state.projects.forEach((p) => {
        if (p.name == project.name) {
          p.files = project.files;
          return;
        }
      });
      state.projects.push(project);
    },
  },
  getters: {
    getProjectByName: (state) => (projectName) => {
      const project = state.projects.find((p) => p.name === projectName);
      return project;
    },
  },
  actions: {},
});
export default store;
