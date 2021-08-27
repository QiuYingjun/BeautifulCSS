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
      var proj = state.projects.find((p) => p.name == project.name);
      if (!proj) {
        state.projects.push(project);
      } else {
        if (project.files) {
          proj.files = project.files;
        }
        if (project.image_url) {
          proj.image_url = project.image_url;
        }
        if (project.description) {
          proj.description = project.description;
        }
      }
    },
    upsertFile(state, { projectName, file }) {
      var proj = state.projects.find((p) => p.name == projectName);
      if (!proj) {
        proj = { name: projectName };
        state.projects.push(proj);
      }
      if (proj.files) {
        var fi = proj.files.find((f) => f.name == file.name);
        if (fi) {
          fi.content = file.content;
        } else {
          proj.files.push(file);
        }
      } else {
        proj.files = [file];
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
