import Vue from "vue";
// import VueRouter from 'vue-router'
import VueRouter from "../vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
// use函数 参数如果是函数 默认直接执行
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "a",
        name: "a",
        component: {
          render(h) {
            return <h2>我是Home a页面</h2>;
          },
        },
      },
      {
        path: "b",
        name: "b",
        component: {
          render(h) {
            return <h2>我是Home b页面</h2>;
          },
        },
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About,
    children: [
      {
        path: "a",
        component: {
          render(h) {
            return <h2>我是about a页面</h2>;
          },
        },
      },
      {
        path: "b",
        component: {
          render(h) {
            return <h2>我是about b页面</h2>;
          },
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 导航守卫 当从一个路由切换到另一个路由会发生什么
// 组件要先离开 beforeRouteLeave
// 切换到新的组件里 beforeEach 进行到某个里面
// A? a=1 => A?a=2 参数更新 -> 组件更新 -> beforeRouteUpdate
// 不是更新 就要走路由中配置的钩子
// 走组件的钩子 beforeRouteEnter
// 确认切换完毕
// beforeResolve
// 都走完毕了 afterEach
// [beforeRouteLeave, beforeEach, beforeRouteUpdate]
router.beforeEach((from, to, next) => {
  // 一秒后切换下个钩子
  setTimeout(next, 100);
});
export default router;
