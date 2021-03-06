import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

const app = createApp(App);
app.config.productionTip = false;

app
  .use(Antd)
  .use(store)
  .use(router)
  .mount("#app");
