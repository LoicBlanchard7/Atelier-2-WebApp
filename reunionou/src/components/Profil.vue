<template>
  <NavBar />
  <div class="container">
    <h3 class="m-3">Informations du profil</h3>
    <form>
      <div class="form-group row mt-2 mb-2">
        <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" v-model="this.email">
        </div>
      </div>
      <div class="form-group row mt-2 mb-2">
        <label class="col-sm-2 col-form-label">Nom</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" v-model="this.name">
          <div class="d-flex mt-2">
            <small class="text-danger" v-if="this.name.length > 20">Le nom ne doit pas dépasser 20 caractères</small>
            <small class="text-danger" v-if="this.name.length === 0">Le nom doit faire au minimum 1 caractère</small>
          </div>
        </div>
      </div>
      <div class="form-group row mt-2 mb-2">
        <label class="col-sm-2 col-form-label">Prénom</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" v-model="this.firstname">
          <div class="d-flex mt-2">
            <small class="text-danger" v-if="this.firstname.length > 20">Le prénom ne doit pas dépasser 20
              caractères</small>
            <small class="text-danger" v-if="this.firstname.length === 0">Le prénom doit faire au minimum 1
              caractère</small>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-secondary mt-3 mb-3" @click="this.update()"
        v-bind:disabled="isValide == false">Sauvegarder les modifications</button>
      <p class="newAccountMessage">{{ this.message }}</p>
      <h4>Modification du mot de passe</h4>
      <div class="form-group row mt-2 mb-2">
        <label class="col-sm-2 col-form-label">Mot de passe :</label>
        <div class="col-sm-10">
          <input type="password" class="form-control" v-model="this.password">
          <div class="d-flex  mt-2">
            <small class="text-danger" v-if="this.password.length > 1 && this.password.length < 8">Le mot de passe doit
              faire au minimum 8 caractères</small>
            <small class="text-danger" v-if="this.password.length > 30">Le mot de passe doit faire moins de 30
              caractères</small>
          </div>
        </div>
      </div>
      <div class="form-group row mt-2 mb-2">
        <label class="col-sm-2 col-form-label">Confirmation du mot de passe:</label>
        <div class="col-sm-10">
          <input type="password" class="form-control" v-model="this.confirmpassword">
          <div class="d-flex flex-column mt-2">
            <small class="text-danger text-left" v-if="this.password !== this.confirmpassword">Le mot de passe n'est pas
              identique</small>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-secondary mt-3 mb-3" @click="this.updatePassword()"
        v-bind:disabled="isValidePassword == false">Modifier le mot de passe</button>
      <p class="newAccountMessage">{{ this.messagepassword }}</p>
      <p class="errorMessage">{{ this.errorMessage }}</p>

    </form>
  </div>
  <Footer />
</template>
<script>
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
import axios from 'axios';
import { inject } from 'vue';

export default {
  name: 'ProfilePage',
  components: { NavBar, Footer },
  data() {
    return {
      uid: "",
      token: "",
      refresh: "",
      name: "",
      firstname: "",
      email: "",
      password: "",
      confirmpassword: "",
      message: "",
      messagepassword: "",
      errorMessage: "",
      apiLink: inject('apiLink')
    }
  },
  computed: {
    /**
     * Méthode permettant de vérifier si le nom et le prénom sont valides
     * @return : true si ils sont valides, false si ils sont invalides
     */
    isValide() {
      if (this.name.length > 20 || this.name.length === 0 || this.firstname.length > 20 || this.firstname.length === 0) {
        return false;
      } else {
        return true;
      }
    },

    /**
     * Méthode permettant de vérifier si le nouveau mot de passe est valide
     * @return : true si le mot de passe est valide, false si le mot de passe est invalide
     */
    isValidePassword() {
      if (this.password.length < 8 || this.password.length > 30 || this.password !== this.confirmpassword) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    /**
     * Méthode permettant de récupérer les données de l'utilisateur.
     * @return : vide
     */
    async getInfoUser() {
      try {
        const user = await axios.get(this.apiLink + "/auth/userId/" + this.uid);
        this.email = user.data.user.email;
        this.name = user.data.user.name;
        this.firstname = user.data.user.firstname;
      } catch (err) {
        this.errorMessage = 'Erreur inconnue';
      }
    },

    /**
     * Méthode permettant de mettre à jour le nom et prénom de l'utilisateur
     * @return : vide
     */
    async update() {
      if (this.isValide) {
        let data = {
          uid: this.uid,
          name: this.name,
          firstname: this.firstname
        };
        try {
          await axios.put(this.apiLink + "/auth/updateUser/", data);
          this.message = "Les modifications ont bien été enregistrées";
        } catch (err) {
          this.errorMessage = 'Erreur inconnue';
        }
      }
    },

    /**
     * Méthode permettant de mettre à jour le mot de passe de l'utilisateur
     * @return : vide
     */
    async updatePassword() {
      if (this.isValidePassword) {
        let data = {
          uid: this.uid,
          name: this.name,
          firstname: this.firstname,
          password: this.password
        }
        try {
          await axios.put(this.apiLink + "/auth/updateUser/", data);
          this.messagepassword = "Le mot de passe a bien été modifié";
          this.password = "";
          this.confirmpassword = "";
        } catch (err) {
          this.errorMessage = 'Erreur inconnue';
        }
      }
    },
  },

  /**
     * Méthode permettant de récupérer les données de l'utilisateur si il est connecté
     * @return : vide
     */
  created() {
    const acc = JSON.parse(sessionStorage.getItem('account'));
    this.uid = acc.uid;
    this.token = acc.access_token;
    this.refresh = acc.refresh_token;
    this.getInfoUser();
  },
}
</script>
<style></style>
