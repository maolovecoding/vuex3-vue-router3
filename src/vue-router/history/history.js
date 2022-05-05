import Base from "./base";

export default class BrowserHistory extends Base {
  constructor(router) {
    super(router);
  }
  /**
   * 调用此方法 监控hash值的变化
   */
  setupListener() {
    // const eventType = "popstate" || "hashchange"
    window.addEventListener("popstate",  (event)=> {
      this.transitionTo(window.location.pathname)
    });
  }
  push(location) {
    // 这里只是调用了 跳转逻辑 ，跳转逻辑不会修改我们的路径
    this.transitionTo(location, () => {
      history.pushState({}, "", location);
    });
  }
  getCurrentLocation() {
    return window.location.pathname;
  }
}
