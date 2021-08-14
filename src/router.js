import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import EditPanel from "@/views/EditPanel.vue";
import Editor from "@/components/Editor.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/BeautifulCSS",
      name: "home",
      component: Home,
    },
    {
      path: "/BeautifulCSS/EditPanel/:projectName",
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
      path: "/BeautifulCSS/EditPanel",
      redirect: "/BeautifulCSS/EditPanel/Glass Card",
    },
  ],
});
