import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "../vuex";

Vue.use(Vuex);

const logger = function (store) {
  let oldState = store.state;
  store.subscribe((mutationType, rootState) => {
    console.log(oldState);
    console.log(mutationType, rootState);
    oldState = rootState
  });
};
/*
  Vuex的目的，就是统一管理状态 可以统一修改状态 更新状态 统一划分模块
*/
const store = new Vuex.Store({
  plugins:[logger],
  state: {
    age: 13,
    name: "张三",
    a: {
      count: 100, // a.count会被覆盖掉
    },
  },
  getters: {
    myAge(state) {
      return state.age + 20;
    },
  },
  mutations: {
    add(state, payload) {
      state.age += payload;
    },
  },
  actions: {
    add({ commit }, payload) {
      setTimeout(() => {
        commit("add", payload);
      }, 1000);
    },
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        name: "a",
        test: "我是a模块的的test数据",
        age: 0,
      },
      mutations: {
        add(state, payload) {
          state.age += payload;
        },
      },
    },
    b: {
      namespaced: true,
      state: {
        name: "b模块",
        test: "b的test数据",
        count: 0,
      },
      mutations: {
        add(state, payload) {
          state.count += payload;
        },
      },
      modules: {
        d: {
          namespaced: true,
          state: {
            name: "我是d模块",
            count: 0,
          },
          mutations: {
            add(state, payload) {
              state.count += payload;
            },
          },
        },
      },
    },
  },
});

// 动态注册模块 比如用户登录后才会有的某些状态
// 在a模块下动态注册e模块
store.registerModule(["a", "e"], {
  namespaced: true,
  state: {
    count: 0,
    age: 20,
  },
  getters: {
    myAge(state) {
      return state.age + 20;
    },
  },
  mutations: {
    add(state, payload) {
      state.age += payload;
    },
  },
});
// ----------没有命名空间-------------
// 1. 子模块的状态state会被定义在根模块上
// 2. 计算属性 子模块的计算属性会被直接添加到根模块上
// 3. mutation 会收集同名的mutation
// 4. action 会收集同名的action

// ----------有命名空间-------------
// 1. 子模块的状态state会被定义在根模块上
// 2. 计算属性要通过命名空间来访问
// 3. mutation action 都通过命名空间访问
export default store;
