import Base from "./base";

export default class HashHistory extends Base {
  constructor(router) {
    super(router);
    // 初始化hash路由的时候 要给定一个默认的hash路径 /
    ensureSlash();
  }
  /**
   * 调用此方法 监控hash值的变化
   */
  setupListener() {
    // const eventType = "popstate" || "hashchange"
    window.addEventListener("hashchange", (event) => {
      // 防止this改变
      // 这里会监听hash值变化 我们通过 location.hash设置 也会监听hash值的变化
      this.transitionTo(getHash());
      console.log(getHash());
    });
  }
  push(location) {
    // 这里只是调用了 跳转逻辑 ，跳转逻辑不会修改我们的路径
    this.transitionTo(location, () => {
      // 手动修改hash值
      window.location.hash = location;
    });
  }
  getCurrentLocation() {
    return getHash();
  }
}
function ensureSlash() {
  if (!window.location.hash) window.location.hash = "/";
}

function getHash() {
  return window.location.hash.slice(1);
}
