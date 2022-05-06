import Module from "./module";
import { forEachValue } from "../utils";
class ModuleCollection {
  // 我们要知道 谁是父亲 谁是孩子
  constructor(options) {
    this.root = null;
    this.register([], options);
  }
  // 注册模块
  register(path, rootModule) {
    const newModule = new Module(rootModule);
    // 每次都暴露动态注册最新的模块 将用户的属性和我包装后的关联在一起
    rootModule.newModule = newModule;
    if (this.root === null) {
      this.root = newModule;
    } else {
      // 拿到当前模块的父模块 因为子模块可能还有自己的子模块
      const parent = path.slice(0, -1).reduce((start, curr) => {
        // return start._children[curr];
        return start.getChild(curr);
      }, this.root);
      // parent._children[path[path.length - 1]] = newModule;
      parent.addChild(path, newModule);
    }
    if (rootModule.modules) {
      forEachValue(rootModule.modules, (moduleName, moduleValue) => {
        this.register(path.concat(moduleName), moduleValue);
      });
    }
  }
  // 获取命名空间的方法
  getNamespace(path) {
    let module = this.root;
    return path.reduce((str, key) => {
      // console.log(module)
      module = module.getChild(key);
      console.log(`${str}${module.namespaced ? `${key}/` : ""}`);
      return `${str}${module.namespaced ? `${key}/` : ""}`;
    }, "");
  }
}
export default ModuleCollection;
