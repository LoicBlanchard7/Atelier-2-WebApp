<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <ul class="navbar-nav me-auto">
        <li class="navbar-brand">
          <router-link class="nav-link" to="/">Reunionou</router-link>
        </li>
      </ul>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if:="isConnect">
            <router-link class="nav-link" to="/createEvent">Créer événement</router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item" v-if="!isConnect">
            <router-link class="nav-link" to="/signIn">Connexion</router-link>
          </li>

          <li class="nav-item" v-if="!isConnect">
            <router-link class="nav-link" to="/signUp">Inscription</router-link>
          </li>
          <li class="nav-item" v-if="isConnect">
            <router-link class="nav-link" to="/Profil"><i class="bi bi-person-circle"></i> Mon profil</router-link>
          </li>
          <li class="nav-item" v-if="isConnect">
            <router-link class="nav-link" to="/signIn" @click="deconnect()">Déconnexion <i class="bi bi-box-arrow-right"></i></router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'NavBar',
  computed: {
    /**
     * Méthode permettant de vérifier si l'utilisateur est connecté.
     * @return : true si il est connecté, false si il n'est pas connecté.
     */
    isConnect() {
        let acc = JSON.parse(sessionStorage.getItem('account'));
        if (acc) {
            return true;
        }else {
            return false;
        }
    },
  },
  methods: {
    /**
     * Méthode permettant de déconnecter l'utilisateur.
     * Renvoie l'utilisateur sur la page d'accueil.
     * @return : vide
     */
    deconnect() {
      this.$store.commit('deconnect', 'Vous êtes bien déconnecté');
      sessionStorage.removeItem('account');
      this.$router.push({ name: 'SignIn' });
    }
  }
}
</script>