export default {
  functional: true, // 标识为函数式组件
  render(h, { parent, data }) {
    // 增加标识 表示渲染过的父组件
    data.routerView = true;
    // 第二个参数可以拿到父组件实例
    // 默认先渲染app.vue中的router-view
    // 再渲染 about组件中的router-view
    const route = parent.$route;
    let depth = 0; // 递归渲染
    // 每次渲染后都给渲染过的组件打上标识属性 router-view
    while (parent) {
      // 不停向上查找父组件
      // vn._vnode -> 是组件中渲染函数中的虚拟节点
      // vm.$vnode -> 是组件本身的虚拟节点(有componentOptions等属性的)
      // $vnode是_vnode的父亲
      if (parent.$vnode?.data?.routerView) {
        // matched数组从前到后是父元素到最后一个子元素
        depth++;
      }
      // 不停的向上查找父组件
      parent = parent.$parent;
    }
    let record = route.matched[depth];
    // 没有匹配到路由记录 直接return
    if (!record) return h();

    // 这里只是为了渲染 而且不记录在父子关系中
    return h(record.component, data);
  },
};
