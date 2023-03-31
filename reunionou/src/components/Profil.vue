<template>
  <NavBar />
  <div class="container">
    <div class="d-flex justify-content-center">
      <div>
        <h3 class="m-5 ">Information du profil</h3>
        <div class="col m-3">
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                
                  <p class="mb-0">Full Name</p>
                
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ this.name }} {{ this.firstname }}</p>
                </div>
              </div>
              <hr>
              <div class="row">
                
                  <p class="mb-0">Email</p>
                
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ this.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      email: ""
    }
  },
  computed: {

  },
  methods: {
    async getEmail() {
      try {
        const user = await axios.get("http://iut.netlor.fr/auth/userId/" + this.uid);
        this.email = user.data.user.email;
      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {
    const acc = JSON.parse(sessionStorage.getItem('account'));
    this.uid = acc.uid;
    this.token = acc.access_token;
    this.refresh = acc.refresh_token;
    this.firstname = acc.firstname;
    this.name = acc.name;
    this.getEmail();
  }
}
</script>
<style></style>
