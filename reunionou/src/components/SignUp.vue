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
                                <input type="password" class="form-control" id="name" v-model="name" required>
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

                            <button type="button" class="btn btn-primary btn-block"
                                @click="addAccount()">S'inscrire</button><br />
                            <small>{{ this.message }}</small>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import "../../scss/custom.scss";

export default {
    name: 'SignUp',
    data() {
        return {
            name: '',
            email: '',
            password: '',
            message: ''
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
        addAccount() {
            if (this.name === '' || this.email === '' || this.password === '' || this.password.length < 8) {
                this.message = 'Veuillez remplir tous les champs';
                return;
            } else {
                let account = {
                    name: this.name,
                    email: this.email,
                    password: this.password
                };
                console.log(account);
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