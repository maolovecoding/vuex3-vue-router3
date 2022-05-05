export default class Base {
  constructor(router) {
    this.router = router;
    this.current = createRoute(null, {
      path: "/",
    });
  }
  /**
   * Vue-router的核心API
   * 所有的逻辑 都要放到该方法内实现
   */
  transitionTo(location, listener) {
    // 根据路径 拿到组件  this.router.match ->  this.router.matcher.match
    const record = this.router.match(location);
    // 一个路径可能匹配还有其父路径的记录 所以先渲染父记录的组件 再渲染子记录的组件
    // record -> { path:"/about/a",matched: [ AboutRecord, AboutARecord ] }
    // console.log(record);
    const route = createRoute(record, { path: location });
    if (
      // 表示重复点击 或者重复操作 刷新等
      location === this.current.path && // 跳转的路径就是当前所在路径
      route.matched.length === this.current.matched.length // 两次匹配到的结果也一样
    )
      return;
    // 维护路由钩子成一个队列
    const queue = [...this.router.beforeEachHooks];
    // 执行钩子 queue from to callback
    runQueue(queue, this.current, route, () => {
      // 每次更新的是current 稍后current变化了，我们就可以切换页面显示
      this.current = route;
      // console.log(this.current);
      // 如果路由发生切换 也要改调用transitionTo方法 再次拿到新的记录
      // console.log(location, listener)
      // 执行钩子
      if (typeof listener === "function") listener();
      // 执行自定义的钩子
      if (typeof this.cb === "function") this.cb(route);
    });
  }
  /**
   * 自定义的一个钩子
   * @param {*} cb
   */
  listen(cb) {
    this.cb = cb;
  }
}

function createRoute(record, location) {
  const matched = [];
  if (record) {
    while (record) {
      matched.unshift(record);
      record = record.parent;
    }
  }
  return {
    ...location,
    matched,
  };
}

function runQueue(queue, from, to, cb) {
  function next(index) {
    if (index >= queue.length) return cb();
    let hook = queue[index];
    hook(from, to, () => next(index + 1));
  }
  next(0);
}
