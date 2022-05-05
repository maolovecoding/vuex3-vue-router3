import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
Vue.config.productionTip = false;

new Vue({
  // 传入路由对象 每个组件都可以拿到路由
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
