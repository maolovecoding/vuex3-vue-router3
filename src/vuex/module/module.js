import { forEachValue } from "../utils";

class Module {
  constructor(module) {
    this._raw = module;
    this._children = {};
    this.state = module.state;
  }
  get namespaced() {
    return !!this._raw.namespaced;
  }
  addChild(path, module) {
    this._children[path[path.length - 1]] = module;
  }
  getChild(moduleName) {
    return this._children[moduleName];
  }
  forEachMutation(cb) {
    this._raw.mutations && forEachValue(this._raw.mutations, cb);
  }
  forEachAction(cb) {
    this._raw.actions && forEachValue(this._raw.actions, cb);
  }
  forEachGetter(cb) {
    this._raw.getters && forEachValue(this._raw.getters, cb);
  }
  forEachModule(cb) {
    // 这里循环模块 应该循环包装后的 这样拿到的是带有模块方法的对象
    forEachValue(this._children, cb);
  }
}
export default Module;
