<template>
  <div id="app">
    <SpinnerComponent :start="spin.value" />
    <router-view />
  </div>
</template>

<script>
import SpinnerComponent from './components/SpinnerComponent.vue';

export default {
  name: 'App',
  components: {
    SpinnerComponent,
  },
  data () {
    return {
      spin: { value: false }
    }
  },
  provide () {
    return { makeSpin: this.spin }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  background: linear-gradient(to right, #88b884 0%, #d6dab8 100%);
}
</style>
