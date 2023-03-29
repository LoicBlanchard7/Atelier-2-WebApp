<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-5">
                    <div class="card-header">
                        <h3 class="text-center">Inscription</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <label for="name">Nom :</label>
                                <input type="text" class="form-control" id="name" v-model="name" required>
                            </div>

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
                                <div v-if="!isValidPassword" class="invalid-feedback">
                                    Le mot de passe doit contenir au moins 8 caractères.
                                </div>
                            </div>

                            <button type="button" class="btn btn-primary btn-block marginT"
                                @click="addAccount()">S'inscrire</button>
                                
                            <br/>
                            <small class="errorMessage marginT">{{ this.errorMessage }}</small>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import "../../scss/custom.scss";

export default {
    name: 'SignUp',
    data() {
        return {
            name: '',
            email: '',
            password: '',
            errorMessage: ''
        };
    },
    computed: {
        isValidEmail() {
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return validEmail.test(this.email);
        },
        isValidPassword() {
            if (this.password.length > 7)
                return true
            else return false;
        }
    },
    methods: {
        async addAccount() {
            if (this.name === '' || this.email === '' || this.password === '' || this.password.length < 8) {
                this.errorMessage = 'Veuillez remplir tous les champs.';
                return;
            } else {
                // let account = {
                //     name: this.name,
                //     email: this.email,
                //     password: this.password
                // };

                try {
                    const user = await axios.post(`http://iut.netlor.fr/auth/signup`, {
                        name: this.name,
                        email: this.email,
                        password: this.password
                    });

                    console.log(user.data);
                    this.errorMessage = '';

                } catch (err) {
                    this.errorMessage = "Une erreur est survenue.";
                }

                this.resetForm();
            }
        },
        resetForm() {
            this.name = '';
            this.email = '';
            this.password = '';
            this.message = '';
            this.numPassword = 0;
        }
    },
    components: {},
};
</script>