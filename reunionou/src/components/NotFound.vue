<template>
    <NavBar/>
      <div class="container">
        <div class="d-flex justify-content-center m-5">
            <div>
                <div class="error404">
                    Erreur<br />
                    404
                </div>
                <h2>Page inexistante</h2>
                <p>La page que vous avez demandé n'existe pas.</p>

                <router-link to="/">Retour à la Home page</router-link>

            </div>
        </div>
    </div>
    <Footer/>

</template>

<script>
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
export default {
    name: 'NotFound',
    components: {NavBar,Footer},
}
</script>

<style>

</style>