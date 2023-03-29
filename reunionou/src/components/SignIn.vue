<template>
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import "../../scss/custom.scss";

export default {
    name: 'SignIn',
    components: {},
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
        }
    },
    computed: {
        isValidEmail() {
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return validEmail.test(this.email);
        }
    },
    methods: {
        async login() {
            if (!this.isValidEmail) {
                return;
            }

            await axios
                .post(`http://iut.netlor.fr/auth/signin`, {
                    email: this.email,
                    password: this.password
                }).then(function (response) {
                    console.log(response.data);

                    this.errorMessage = '';
                }).catch(function (error) {
                    console.log(error);
                    this.errorMessage = "L'adresse mail ou le mot de passe est incorrecte.";
                });

            this.resetForm();

        },
        resetForm() {
            this.email = '';
            this.password = '';
        }
    }
}
</script>