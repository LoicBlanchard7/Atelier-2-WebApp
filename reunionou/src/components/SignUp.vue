<template>
    <NavBar />
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
                                <div class="mt-2">
                                    <small class="text-danger" v-if="this.name.length > 20">Le prénom ne doit pas dépasser
                                        20
                                        caractères</small>
                                    <small class="text-danger" v-if="this.name.length === 0">Le prénom doit faire au minimum
                                        1
                                        caractère</small>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="name">Prénom :</label>
                                <input type="text" class="form-control" id="firstname" v-model="firstname" required>
                                <div class="mt-2">
                                    <small class="text-danger" v-if="this.firstname.length > 20">Le prénom ne doit pas
                                        dépasser 20
                                        caractères</small>
                                    <small class="text-danger" v-if="this.firstname.length === 0">Le prénom doit faire au
                                        minimum 1
                                        caractère</small>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="email">E-mail :</label>
                                <input type="email" class="form-control" id="email" v-model="email" required>
                                <div class="mt-2">
                                    <small class="text-danger" v-if="!isValidEmail">Veuillez renseigné un email valide.</small>
                                    
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="password">Mot de passe :</label>
                                <input type="password" class="form-control" id="password" v-model="password" required>
                                <div class="mt-2">
                                    <small class="text-danger" v-if="this.password.length > 30">Le mot de passe ne doit pas
                                        dépasser 30
                                        caractères</small>
                                    <small class="text-danger" v-if="this.password.length < 8">Le mot de passe doit faire 8
                                        caractères</small>
                                </div>
                            </div>

                            <button type="button" class="btn btn-primary btn-block marginT" @click="addAccount()"
                                :disabled="isValidInfo == false || isValidEmail == false">S'inscrire</button>

                            <br />
                            <small class="errorMessage marginT">{{ this.errorMessage }}</small>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>
<script>
import axios from "axios";
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
export default {
    name: 'SignUp',
    components: { NavBar, Footer },
    data() {
        return {
            name: '',
            firstname: '',
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
        isValidInfo() {
            if (this.name.length > 20 || this.name.length === 0 || this.firstname.length > 20 || this.firstname.length === 0 || this.password.length > 30 || this.password.length < 8) {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        addAccount() {
            if (this.isValidInfo || this.isValidEmail || this.isValidPassword) {
                if (this.name === '' || this.email === '' || this.password === '' || this.firstname === '' || this.password.length < 8) {
                    this.errorMessage = 'Veuillez remplir tous les champs.';
                    return;
                } else {
                    axios.post(`http://iut.netlor.fr/auth/signup`, {
                        name: this.name,
                        firstname: this.firstname,
                        email: this.email,
                        password: this.password
                    }).then(response => {
                        console.log(response.data);
                        this.resetForm();
                        this.errorMessage = '';
                        this.$store.commit('newAccount', 'Votre compte a bien été créé. Vous pouvez maintenant vous connecter.');
                        this.$router.push({ name: "SignIn", path: 'SignIn' });
                    }).catch(e => {
                        if (e.request.status === 409)
                            this.errorMessage = `L'adresse e-mail est déjà utilisée.`;
                        else
                            this.errorMessage = `Une erreur est survenue.`;
                    });
                }
            }
        },
        resetForm() {
            this.name = '';
            this.email = '';
            this.password = '';
        }
    },
};
</script>
<style></style>