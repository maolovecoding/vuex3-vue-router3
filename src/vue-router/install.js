import routerLink from "./components/router-link";
import routerView from "./components/router-view";

// 用来保存用户传递的全局vue
export let Vue;
function install(_Vue) {
  // 保存vue构造函数 变成全局的
  Vue = _Vue;
  // 这里不能直接将属性定义在原型上 只有通过 new Vue传入了router 才能共享
  Vue.mixin({
    beforeCreate() {
      // 父 -> 子 -> 孙
      // 组件渲染是从父到子的
      if (this.$options.router) {
        // 这里的 this -> 根实例
        // 根实例 new Vue传递了 router选项
        this._router = this.$options.router;
        // 原vue-router是通过在根router传给子元素的
        this._routerRoot = this;

        // 初始化一次 this就是 new Vue的根实例
        this._router.init(this);
        // 定义响应式 给根实例添加一个属性 _route 就是当前的current对象
        Vue.util.defineReactive(this, "_route", this._router.history.current);
      } else {
        // 子组件 都增加了一个 _routerRoot 指向根实例；
        this._routerRoot = this.$parent?._routerRoot;
      }
      // 组件中都可以通过 this._routerRoot._router 拿到router实例
      // console.log(this);
    },
  });
  // 代理 每个实例上都可以通过 this.$router 拿到路由对象
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot?._router;
    },
  });
  // 所有组件都可以拿到 $route 属性 对应的值就是 匹配到的current路由规则
  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot?._route;
    },
  });

  // 注册 router-link router-view组件
  Vue.component("router-link", routerLink);
  Vue.component("router-view", routerView);
}
export default install;
