<template>
  <NavBar />
  <div class="container">
    <h3 class="m-3">Information du profil</h3>
    <form>
      <div class="form-group row mt-2 mb-2">
        <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" v-model="this.email">
        </div>
      </div>
      <div class="form-group row mt-2 mb-2">
        <label for="inputPassword" class="col-sm-2 col-form-label">Nom</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="inputPassword" v-model="this.name">
          <div class="d-flex mt-2">
            <small class="text-danger" v-if="this.name.length >= 50">Le nom ne doit pas dépasser 50 caractères</small>
            <small class="text-danger" v-if="this.name.length === 0">Le nom doit faire au minimum 1 caractère</small>
          </div>
        </div>
      </div>
      <div class="form-group row mt-2 mb-2">
        <label for="inputPassword" class="col-sm-2 col-form-label">Prénom</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="inputPassword" v-model="this.firstname">
          <div class="d-flex mt-2">
            <small class="text-danger" v-if="this.firstname.length >= 50">Le prénom ne doit pas dépasser 50
              caractères</small>
            <small class="text-danger" v-if="this.firstname.length === 0">Le prénom doit faire au minimum 1
              caractère</small>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-secondary mt-3 mb-3" @click="this.update()"
        v-bind:disabled="isValide == false">Sauvegarder les modifications</button>
      <p class="newAccountMessage">{{ this.message }}</p>
    </form>
  </div>
  <Footer />
</template>
<script>
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
import axios from 'axios';

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
      message: ""
    }
  },
  computed: {
    isValide() {
      if (this.name.length >= 50 || this.name.length === 0 || this.firstname.length >= 50 || this.firstname.length === 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    async getEmail() {
      try {
        const user = await axios.get("http://iut.netlor.fr/auth/userId/" + this.uid);
        this.email = user.data.user.email;
      } catch (err) {
        console.log(err);
      }
    },
    async update() {
      if (this.isValide) {
        try {
          await axios.put("http://iut.netlor.fr/auth/updateUser/", {
            uid: this.uid,
            name: this.name,
            firstname: this.firstname
          });
          this.message = "Les modifications ont bien été enregistrées";
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
  created() {
    const acc = JSON.parse(sessionStorage.getItem('account'));
    this.uid = acc.uid;
    this.token = acc.access_token;
    this.refresh = acc.refresh_token;
    this.firstname = acc.firstname;
    this.name = acc.name;
    this.getEmail();
  },
}
</script>
<style></style>
