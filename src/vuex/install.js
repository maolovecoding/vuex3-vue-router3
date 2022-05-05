export let Vue;
export default function install(_Vue) {
  // 记录Vue构造函数
  Vue = _Vue;
  Vue.mixin({
    // 让所有组件都定义一个 $store属性 可以用来获取 store实例
    beforeCreate() {
      // 根实例
      if (this.$options.store) {
        this.$store = this.$options.store;
      } else if (this.$parent?.$store) {
        this.$store = this.$parent.$store;
      }
    },
  });
}
