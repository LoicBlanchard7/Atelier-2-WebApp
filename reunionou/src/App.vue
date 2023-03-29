<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <!-- Marque -->

      <li class="navbar-brand">
        <router-link class="nav-link" to="/">Reunionou</router-link>
      </li>

      <!-- Bouton de navigation mobile -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Liens de navigation -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Lien Home -->


          <!-- Lien HelloWorld -->
          <li class="nav-item">
            <router-link class="nav-link" to="/helloWorld">HelloWorld</router-link>
          </li>

          <!-- Lien Créer événement -->
          <li class="nav-item">
            <router-link class="nav-link" to="/createEvent">Créer événement</router-link>
          </li>
        </ul>

        <!-- Liens de connexion et inscription alignés à droite -->
        <ul class="navbar-nav">
          <!-- Lien Connexion -->
          <li class="nav-item">
            <router-link class="nav-link" to="/signIn">Connexion</router-link>
          </li>

          <!-- Lien Inscription -->
          <li class="nav-item">
            <router-link class="nav-link" to="/signUp">Inscription</router-link>
          </li>
        </ul>
      </div>
    </div>
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
  margin-bottom: 60px;
}
</style>
