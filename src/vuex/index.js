import install, { Vue } from "./install";
import { forEachValue } from "./utils";
import { ModuleCollection } from "./module";

// 取出替换后store上最新的state状态
function getState(store, path) {
  return path.reduce((start, curr) => start[curr], store.state);
}
function installModule(store, rootState, path, rootModule) {
  if (path.length > 0) {
    // 根模块 只有是子模块的时候 才需要将子模块的状态定义在根模块上
    const parent = path
      .slice(0, -1)
      .reduce((start, curr) => start[curr], rootState);
    // 动态添加模块的时候 这里没有该属性
    store._withCommitting(() => {
      // 合法替换 不需要监控
      Vue.set(parent, path[path.length - 1], rootModule.state);
    });
    // parent[path[path.length - 1]] = rootModule.state;
  }
  // 我们需要获取命名空间前缀
  const namespaced = store._modules.getNamespace(path);
  // console.log(namespaced)
  rootModule.forEachMutation((mutationName, value) => {
    store._mutations[namespaced + mutationName] =
      store._mutations[namespaced + mutationName] || [];
    store._mutations[namespaced + mutationName].push((payload) => {
      store._withCommitting(() => {
        // 更改状态的情况是在 _committing 为 true的时候
        value(getState(store, path), payload);
      });
      store.subscribes.forEach((fn) => {
        fn({ type: namespaced + mutationName, payload }, store.state);
      });
    });
  });
  rootModule.forEachAction((actionName, value) => {
    store._actions[namespaced + actionName] =
      store._actions[namespaced + actionName] || [];
    store._actions[namespaced + actionName].push((payload) => {
      const res = value(store, payload);
      return res;
    });
  });
  rootModule.forEachGetter((getterName, value) => {
    if (store._wrapGetters[namespaced + getterName]) {
    }
    store._wrapGetters[namespaced + getterName] = () =>
      value(getState(store, path));
  });
  rootModule.forEachModule((moduleName, module) => {
    installModule(store, rootState, path.concat(moduleName), module);
  });
}
function resetStoreVM(store, state) {
  // 需要删除老的响应式对象 在动态注册的时候
  let oldVm = store._vm;
  store.getters = {};
  const computed = {};
  const wrapGetters = store._wrapGetters;
  forEachValue(wrapGetters, (getterKey, getterValue) => {
    // 包裹的计算属性
    computed[getterKey] = getterValue;
    Object.defineProperty(store.getters, getterKey, {
      get: () => store._vm[getterKey],
    });
  });
  store._vm = new Vue({
    data: {
      // 状态
      $$state: state,
    },
    // 计算属性
    computed,
  });
  if (store._strict) {
    store._vm.$watch( // 浪费性能 开发环境使用
      () => store._vm._data.$$state,
      () => {
        console.assert("outside mutation");
      },
      {
        sync: true, // 同步的queueWatcher队列
        deep: true, // 深度侦听
      }
    );
  }
  // 销毁旧的vm
  oldVm && Vue.nextTick(() => oldVm.$destroy());
}
class Store {
  constructor(options) {
    this.subscribes = [];
    this.plugins = options.plugins || [];
    // 是否是严格模式
    this._strict = options.strict;
    // 在mutation中更改，我们做一个变量，值为true 表示是在mutation中修改的
    this._committing = false;
    // 模块收集 确定父子模块关系等 root -> {children -> {children -> }}
    this._modules = new ModuleCollection(options);
    this._mutations = Object.create(null);
    this._actions = Object.create(null);
    // 存放计算属性
    this._wrapGetters = Object.create(null);
    // 根模块的状态
    const state = this._modules.root.state;
    installModule(this, state, [], this._modules.root);
    // console.log(state);
    // 创建store容器 创建 和 初始化功能
    resetStoreVM(this, state); // 创建实例 将计算属性和state声明到store上
    // 执行插件
    this.plugins.forEach((plugin) => plugin(this));
  }
  get state() {
    return this._vm._data.$$state;
  }
  _withCommitting(fn) {
    this._committing = true;
    fn();
    this._committing = false;
  }
  // 防止解构过程中 this弄没了
  commit = (mutationType, payload) => {
    this._mutations[mutationType].forEach((fn) => fn.call(this, payload));
  };
  // 防止解构过程中 this弄没了
  dispatch = (actionType, payload) => {
    return Promise.all(
      this._actions[actionType].map((fn) => fn.call(this, payload))
    );
  };

  registerModule(path, module) {
    // 这个module是用户的 不是我们使用new Module包装后的
    this._modules.register(path, module);
    installModule(this, this.state, path, module.newModule);
    // 动态添加的计算属性也没生效 需要重新注册一个响应式对象 删除旧的vm
    resetStoreVM(this, this.state); // 重置当前实例 vm
  }
  subscribe(cb) {
    this.subscribes.push(cb);
  }
  // state替换
  replaceState(state) {
    this._committing(() => {
      this._vm._data.$$state = state;
    });
  }
}

// Store.install = install;
export default {
  Store,
  install,
};

/*
class Store {
  constructor(options) {
    // 模块收集 确定父子模块关系等
    this._modules = new ModuleCollection(options);
    console.log(this._modules);
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
*/
