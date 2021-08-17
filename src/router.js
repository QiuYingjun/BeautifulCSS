import { createRouter, createWebHashHistory} from "vue-router";

import Home from "@/views/Home.vue";
import EditPanel from "@/views/EditPanel.vue";
import Editor from "@/components/Editor.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/EditPanel/:projectName",
      name: "EditPanel",
      component: EditPanel,
      props: true,
      children: [
        {
          path: "",
          component: Editor,
          props: true,
        },
      ],
    },
    {
      path: "/EditPanel",
      redirect: "/EditPanel/Glass Card",
    },
  ],
});
