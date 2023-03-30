<template>
      <NavBar/>

    <h2>Page inexistante</h2>
    <p>La page que vous avez demandé n'existe pas.</p>

    <router-link to="/">Retour à la Home page</router-link>

    <div class="error404">
        Erreur<br />
        404
    </div>
</template>

<script>
import NavBar from './NavBar.vue';
export default {
    name: 'NotFound',
    components: {NavBar},
}
</script>

<style>
.error404 {
    margin-top: 30px;
    margin-bottom: 30px;
    font-weight: bold;
    color: red;
    font-size: 100px;
}
</style>