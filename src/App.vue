<template>
  <Navbar class="navbar"></Navbar>
  <router-view></router-view>
</template>

<script>
import Navbar from "@/components/content/NavBar/NavBar.vue";

export default {
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}

.navbar {
  margin-bottom: 30px;
}
</style>
