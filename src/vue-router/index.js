/*
 * @Author: 毛毛
 * @Date: 2022-05-04 13:27:46
 * @Last Modified by: 毛毛
 * @Last Modified time: 2022-05-05 00:25:15
 */

import install, { Vue } from "./install";
import createMatcher from "./create-matcher";
import HashHistory from "./history/hash";
import BrowserHistory from "./history/history";

class VueRouter {
  constructor(options) {
    // 路由配置规则
    const routes = options.routes;
    // 将每个 route 都放到映射表中 方便后续的匹配操作 可以匹配 也可以添加新路由规则
    this.matcher = createMatcher(routes) || [];
    // 路由钩子
    this.beforeEachHooks = [];
    // console.log(routes);
    // console.log(this.matcher)
    // 根据不同的模式 创建不同的路由系统
    const mode = options.mode;
    if (mode === "hash") {
      // hashchange
      this.history = new HashHistory(this);
    } else if (mode === "history") {
      // pushState pop
      this.history = new BrowserHistory(this);
    }
    console.log(this.history);
  }
  /**
   * 监听路由变化的初始化工作
   * @param {*} app vue根实例
   */
  init(app) {
    let history = this.history;
    // 根据路径的变化 匹配对应的组件来进行渲染 路径变化了 需要更新视图（响应式的）
    // 根据路径 匹配到对应的组件 来渲染 之后监听路由变化
    history.transitionTo(history.getCurrentLocation(), () => {
      // 监控路径的变化
      history.setupListener();
    });
    // 每次路由切换的时候 都需要调用listen方法中的回调函数 实现更新
    history.listen((newRoute) => {
      // 更新 实例上的current 这样更新才能实现响应式更新 $route -> history.current
      app._route = newRoute;
    });
  }

  match(location) {
    return this.matcher.match(location);
  }
  push(location) {
    return this.history.push(location);

  }
  beforeEach(cb) {
    this.beforeEachHooks.push(cb);
  }
}
/**
 * 1. 我们需要将用户的配置进行映射
 * 2. 要将根实例注入router属性共享给每个组件
 */
// 类也会编译为函数 所以为了vue.use函数的执行 需要挂上一个install函数
// 导出的是类，我们会优先调用install方法的
VueRouter.install = install;
export default VueRouter;
