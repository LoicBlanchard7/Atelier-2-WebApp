<template>
    <NavBar />

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-5">
                    <div class="card-header">
                        <h3 class="text-center">Rejoindre un événement</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <label for="email">Nom:</label>
                                <input type="text" class="form-control" id="email" v-model="name" required>
                            </div>
                            <div class="form-group">
                                <label for="text">Prénom :</label>
                                <input type="text" class="form-control" id="password" v-model="firstname" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block marginT">Rejoindre l'événement</button>
                            <p class="errorMessage">{{ this.errorMessage }}</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
import { uuid } from 'vue-uuid';
import { inject } from 'vue';

export default {
    name: 'SignIn',
    components: { NavBar, Footer },
    data() {
        return {
            uuid: uuid.v4(),
            name: '',
            firstname: '',
            errorMessage: '',
            apiLink: inject('apiLink')
        }
    },
    computed: {
        ...mapState(['account', 'deco']),

        /**
         * Méthode permettant de récupérer l'id de l'évènement placé en paramètre.
         * @return : L'id de l'évènement placé en paramètre
         */
        eid() { return this.$route.params.id },
    },
    methods: {
        /**
         * Méthode permettant d'ajouter un utilisateur qui n'a pas de compte à la liste des participants grâce aux données du formulaire.
         * @return : vide
         */
        async login() {
            try {
                const link = this.apiLink + `/participants/add`;
                await axios
                    .post(link, {
                        uid: this.uuid,
                        eid: this.eid,
                        name: this.name,
                        firstname: this.firstname,
                    });

                this.errorMessage = '';
                sessionStorage.setItem('participantsUid', JSON.stringify(this.uuid));
                this.$router.push({ name: 'Event', params: { id: this.eid } });
            } catch (err) {
                this.errorMessage = "L'adresse mail ou le mot de passe est incorrecte.";
            }
            this.resetForm();
        },

        /**
         * Méthode permettant de remettre à zéro le formulaire de modification d'évènement.
         * @return : vide
         */
        resetForm() {
            this.name = '';
            this.firstname = '';
        }
    },

    async created() {
        let acc = JSON.parse(sessionStorage.getItem('account'));
        if (acc !== null) {
            let userFirstname = "";
            let userName = "";

            try {
                const user = await axios
                    .get(this.apiLink + `/auth/userId/` + acc.uid);
                userFirstname = user.data.user.firstname;
                userName = user.data.user.name;
            } catch (err) {
                this.errorMessage = 'Erreur inconnue';
            }

            try {
                const link = this.apiLink + `/participants/add`;

                await axios
                    .post(link, {
                        uid: acc.uid,
                        eid: this.eid,
                        name: userName,
                        firstname: userFirstname,
                    }, {
                        headers: { Authorization: `Bearer ${acc.access_token}` }
                    });
            } catch (err) {
                this.errorMessage = 'Erreur inconnue';
            }

            this.$router.push({ name: 'Event', params: { id: this.eid } });
        }
    },
}
</script>