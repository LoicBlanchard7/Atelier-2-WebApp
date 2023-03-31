<template>
      <NavBar/>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-5">
                    <div class="card-header">
                        <h3 class="text-center">Connexion</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <label for="email">E-mail :</label>
                                <input type="email" class="form-control" id="email" v-model="email" required>
                                <div v-if="!isValidEmail" class="invalid-feedback">
                                    Veuillez entrer une adresse e-mail valide.
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="password">Mot de passe :</label>
                                <input type="password" class="form-control" id="password" v-model="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block marginT">Se connecter</button>

                            <br />

                            <small class="errorMessage marginT">{{ this.errorMessage }}</small>
                            <small class="newAccountMessage marginT" >{{ newAccount }}</small>
                            <small class="newAccountMessage marginT" >{{ goodDeco }}</small>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer/>

</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
export default {
    name: 'SignIn',
    components: {NavBar,Footer},
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
        }
    },
    computed: {
        ...mapState(['account','deco']),
        newAccount() {
            return this.account;
        },
        goodDeco() {
            return this.deco;
        },
        isValidEmail() {
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return validEmail.test(this.email);
        },  
    },
    methods: {
        async login() {
            if (!this.isValidEmail) {
                return;
            }
            try {
                const user = await axios
                    .post(`http://iut.netlor.fr/auth/signin`, {
                        email: this.email,
                        password: this.password
                    });
                this.errorMessage = '';
                this.names = await this.getNames(user.data.uid);
                let newStorage = Object.assign({},user.data, this.names);
                sessionStorage.setItem('account', JSON.stringify(newStorage));
                this.$router.push({ name: 'Home' });
            } catch (err) {
                console.log(err);
                this.errorMessage = "L'adresse mail ou le mot de passe est incorrecte.";
            }
            this.resetForm();
        },
        async getNames(uid){
            try {
                const user = await axios
                    .get(`http://iut.netlor.fr/auth/userId/`+uid);
                let names = {
                    firstname: user.data.user.firstname,
                    name: user.data.user.name};
                return names;
            } catch (err) {
                console.log(err);
            }
        },
        resetForm() {
            this.email = '';
            this.password = '';
        }
    },
}
</script>
<style>

</style>