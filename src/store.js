// store.js
import { createStore } from "vuex";

const store = createStore({
  state: {
    projects: [],
  },
  mutations: {
    upsertProject(state, project) {
      var success = false;
      state.projects.forEach((p) => {
        if (p.name == project.name) {
          if (project.files) {
            p.files = project.files;
          }
          if (project.image_url) {
            p.image_url = project.image_url;
          }
          if (project.description) {
            p.description = project.description;
          }
          success = true;
        }
      });
      if (!success) {
        state.projects.push(project);
      }
    },
  },
  getters: {
    getProjectByName: (state) => (projectName) => {
      const project = state.projects.find((p) => p.name === projectName);
      return project;
    },
    getProjectSummary: (state) => () => {
      return state.projects;
    },
  },
  actions: {},
});
export default store;
