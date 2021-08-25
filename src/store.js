// store.js
import { createStore } from "vuex";
import axios from "axios";
import { Base64 } from "js-base64";

function getExt(fileName) {
  var e = fileName.split(".").slice(-1)[0];
  switch (e) {
    case "md":
      e = "markdown";
      break;
    case "js":
      e = "javascript";
      break;
  }
  return e;
}
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
    upsertFile(state, { projectName, file }) {
      state.projects.forEach((p) => {
        if (p.name == projectName) {
          if (p.files) {
            var success = false;
            p.files.forEach((f) => {
              if (f.name == file.name) {
                success = true;
                f = file;
              }
            });
            if (!success) {
              p.files.push(file);
            }
          } else {
            p.files = [file];
          }
        }
      });
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
  actions: {
    getFilesFromAPI(store, projectName) {
      var url =
        "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects/" +
        projectName;
      axios
        .get(url)
        .then((response) => {
          console.log("获取" + projectName + "文件一览");
          response.data.forEach((record) => {
            var ext = getExt(record.name);
            if (["html", "javascript", "css"].indexOf(ext) > -1) {
              axios.get(record.download_url).then((res) => {
                var file = {
                  content: res.data,
                  name: record.name,
                  ext: ext,
                  id: record.sha,
                  isActive: false,
                  key: record.name,
                  tab: record.name,
                };
                if (ext == "html") {
                  file.isActive = true;
                }
                store.commit("upsertFile", { projectName, file });
                console.log("获取" + file.name + "文件内容");
              });
            }
          });
        })
        .catch((e) => {
          console.error(e);
        });
    },
    getProjectListFromAPI: function(store) {
      axios
        .get(
          "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects"
        )
        .then((p_response) => {
          console.log("获取工程一览");
          p_response.data.forEach((p_record) => {
            axios
              .get(
                "https://api.github.com/repos/QiuYingjun/BeautifulCSS/contents/projects/" +
                  p_record.name +
                  "/readme.md"
              )
              .then((f_response) => {
                var project = {};
                project.name = p_record.name;
                project.description = "";
                // 去掉标题后，取第一行为说明文本
                for (const s of Base64.decode(f_response.data.content)
                  .replace(/^#.*/, "")
                  .split("\n")) {
                  if (s != "" && project.description == "") {
                    project.description = s;
                    break;
                  }
                }
                project.image_url =
                  "https://raw.githubusercontent.com/QiuYingjun/BeautifulCSS/main/projects/" +
                  project.name +
                  "/readme.png";
                store.commit("upsertProject", project);
              });
          });
        });
    },
  },
});
export default store;
