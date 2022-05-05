import install, { Vue } from "./install";

class Store {
  constructor(options) {
    const { state, getters, mutations, actions, modules } = options;
    // 我们期望状态是响应式的 状态变化时可以更新视图
    // this.state = state;
    const computed = {};
    this.getters = {};
    if (getters) {
      Object.keys(getters).forEach((key) => {
        // 使用计算属性做缓存
        computed[key] = () => getters[key](this.state);
        // 代理 计算属性代理到store实例的getters上
        Object.defineProperty(this.getters, key, {
          get: () => this._vm[key],
        });
      });
    }
    // vuex完全依赖于vue 如果在别的地方使用 是没办法收集watcher
    // 所以vuex只能为vue服务
    this._vm = new Vue({
      data: {
        // 在定义数据的时候 vue会对 _ $等开头的属性做退让 不会进行代理
        // 也就是不会直接放到 vm上 只能通过 vm._data取
        $$state: state,
      },
      computed,
    });

    this.mutations = mutations;
    this.actions = actions;
  }
  get state() {
    return this._vm._data.$$state;
  }
  // 防止解构过程中 this弄没了
  commit = (mutationType, payload) => {
    this.mutations[mutationType](this.state, payload);
  };
  // 防止解构过程中 this弄没了
  dispatch = (actionType, payload) => {
    this.actions[actionType](this, payload);
  };
}

// Store.install = install;
export default {
  Store,
  install,
};
