import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  // 传入路由对象 每个组件都可以拿到路由
  router,
  render: h => h(App)
}).$mount('#app')
