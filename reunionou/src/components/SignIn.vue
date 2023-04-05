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
                            <small class="newAccountMessage marginT" >{{ validLogout }}</small>
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
import { inject} from 'vue';

export default {
    name: 'SignIn',
    components: {NavBar,Footer},
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
            apiLink : inject('apiLink')
        }
    },
    computed: {
        ...mapState(['account','deco']),

        /**
         * Méthode permettant de récupérer le compte
         * @return : Le compte
         */
        newAccount() {
            return this.account;
        },

        /**
         * Méthode permettant de vérifier si la déconnexion est effectuée.
         * @return : Déconnexion
         */
        validLogout() {
            return this.deco;
        },

        /**
         * Méthode permettant de vérifier si l'adresse mail saisi est valide.
         * @return : true si l'adresse est valide, false si l'adresse n'est pas valide.
         */
        isValidEmail() {
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return validEmail.test(this.email);
        },  
    },
    methods: {
        /**
         * Méthode permettant de se connecter à un compte avec les données du formulaire de connexion.
         * @return : vide
         */
        async login() {
            if (!this.isValidEmail) {
                return;
            }
            try {
                const user = await axios
                    .post(this.apiLink+`/auth/signin`, {
                        email: this.email,
                        password: this.password
                    });
                this.errorMessage = '';
                sessionStorage.setItem('account', JSON.stringify(user.data));
                this.$router.push({ name: 'Home' });
            } catch (err) {
                this.errorMessage = "L'adresse mail ou le mot de passe est incorrecte.";
            }
            this.resetForm();
        },

        /**
         * Méthode permettant de remettre à zéro le formulaire de connexion.
         * @return : vide
         */
        resetForm() {
            this.email = '';
            this.password = '';
        }
    },
}
</script>
<style>

</style>