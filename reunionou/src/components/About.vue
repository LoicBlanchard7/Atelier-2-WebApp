<template>
  <NavBar />

  <div class="container">
    <div class="hello">
      <h1>A propos</h1>
    </div>
  </div>

  <Footer />
</template>
<script>
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
export default {
  name: 'AboutPage',
  components: { NavBar, Footer },
}
</script>
