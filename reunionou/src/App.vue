<template>
  <h1>Reunionou</h1>

  <nav>
    <router-link to='/'>Home</router-link>
    |
    <router-link to="/helloWorld">HelloWorld</router-link>
    |
    <router-link to='/signIn'>Connection</router-link>
  </nav>

  <router-view />
</template>

<script>
export default {
  name: 'App',
  components: {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
