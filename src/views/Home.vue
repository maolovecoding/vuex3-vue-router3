<template>
  <div class="home">
    <h3>age: {{ $store.state.age }}</h3>
    <h3>Myage: {{ $store.getters.myAge }}</h3>
    <button @click="$store.commit('add',2)">提交mutation</button>
    <button @click="$store.dispatch('add',3)">派发action</button>
    <h3>我是a模块：test: {{$store.state.a.test}}</h3>
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <router-link to="/a">切换a页面</router-link>
    <router-link to="/b">切换b页面</router-link>
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
};
</script>
