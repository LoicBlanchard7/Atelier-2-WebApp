<template>
    <NavBar />

    <div class="container">
        <div v-if="!isConnected">
            <h3>Réunionou</h3>
            <p>Bienvenue sur Réunionnou, veuillez vous connecté.</p>
        </div>
        <div v-else>
            <div class="btn-toolbar justify-content-center m-3 p-1" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-outline-primary m-1" :disabled="allDisabled"
                    @click="setFilter('Tous')">Tous</button>
                <button type="button" class="btn btn-outline-primary  m-1" :disabled="toComeDisabled"
                    @click="setFilter('A venir')">A venir</button>
                <button type="button" class="btn btn-outline-primary  m-1" :disabled="pendingDisabled"
                    @click="setFilter('En attente')">En attente</button>
                <button type="button" class="btn btn-outline-primary  m-1" :disabled="myEventDisabled"
                    @click="setFilter('Mes évènements')">Mes évènements</button>
            </div>

            <div class="card-group justify-content-center justify-content-xxl-start">

                <div v-for="event in eventCreatedByUserToShow" :key="event.eid" class="m-1">
                    <div class="card cardWidth h-100 card">
                        <div class="card-body cardBackground">
                            <h5 class="card-title">{{ event.title }}</h5>
                            <p class="card-text">{{ event.description }}</p>

                            <div class="btn-toolbar justify-content-center m-3 p-1" role="group" aria-label="Basic example">
                                <button class="btn btn-primary m-1" @click="goToEvent(event.eid)"><i class="bi bi-eye"></i></button>
                                <button class="btn btn-primary m-1" @click="UpdateEvent(event.eid)"><i class="bi bi-pencil"></i></button>
                            </div>

                        </div>
                        <div class="card-footer"><small class="text-muted">{{ new
                            Date(event.date).toLocaleDateString('fr-FR', {
                                weekday: "long", year: "numeric",
                                month: "short", day: "numeric"
                            }) }}</small></div>
                    </div>
                </div>

                <div v-for="event in eventToShow" :key="event.eid" class="m-1">
                    <div class="card cardWidth h-100 ">
                        <div class="card-body cardBackground">
                            <h5 class="card-title" v-bind:class="showStatus(event.status)">{{ event.event.title }}</h5>
                            <p class="card-text">{{ event.event.description }}</p>
                            <p class="card-text">Créateur : {{ event.creator }}</p>
                            <button class="btn btn-primary" @click="goToEvent(event.event.eid)"><i class="bi bi-eye"></i></button>
                        </div>
                        <div class="card-footer"><small class="text-muted">{{ new
                            Date(event.event.date).toLocaleDateString('fr-FR', {
                                weekday: "long", year: "numeric",
                                month: "short", day: "numeric"
                            }) }}</small></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>
<script>
import NavBar from './NavBar.vue';
import axios from 'axios';
import Footer from './Footer.vue';
import { inject} from 'vue';

export default {
    name: 'HomePage',
    components: { NavBar, Footer },
    data() {
        return {
            userUid: "",
            userToken: "",
            userRefresh: "",
            events: [],
            filter: "Tous",
            eventCreatedByUser: [],
            eventParticipate: [],
            eventPending: [],
            apiLink : inject('apiLink')
        }
    },
    computed: {
        /**
         * Méthode permettant de déterminer si l'utilisateur est connecté à l'application.
         * @return : true si l'utilisateur est connecté, false si l'utilisateur n'est pas connecté.
         */
        isConnected() {
            let acc = JSON.parse(sessionStorage.getItem('account'));
            if (acc !== null) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Méthode permettant de trier les évènements à afficher selon le tri sélectionné.
         * @return : Les évènements filtrer
         */
        eventToShow() {
            if (this.filter === "A venir") {
                return this.events.filter(event => new Date(event.event.date) > new Date());
            } else if (this.filter === "En attente") {
                return this.events.filter(event => event.status === "pending");
            } else if (this.filter === "Tous") {
                return this.events;
            } else {
                return [];
            }
        },

        /**
         * Méthode permettant de déterminer les évènements créé par l'utilisateur
         * @return : Les évènements créé par l'utilisateur
         */
        eventCreatedByUserToShow() {
            if (this.filter === "Mes évènements" || this.filter === "Tous") {
                return this.eventCreatedByUser;
            } else if (this.filter === "A venir") {
                return this.eventCreatedByUser.filter(event => new Date(event.date) > new Date());
            } else {
                return [];
            }
        },

        /**
         * Méthode permettant de déterminer si le filtrer déterminer est "Tous"
         * @return : true si c'est ce filtre, false si ce n'est pas ce filtre
         */
        allDisabled() {
            if (this.filter === "Tous") {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Méthode permettant de déterminer si le filtrer déterminer est "A venir"
         * @return : true si c'est ce filtre, false si ce n'est pas ce filtre
         */
        toComeDisabled() {
            if (this.filter === "A venir") {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Méthode permettant de déterminer si le filtrer déterminer est "En attente"
         * @return : true si c'est ce filtre, false si ce n'est pas ce filtre
         */
        pendingDisabled() {
            if (this.filter === "En attente") {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Méthode permettant de déterminer si le filtrer déterminer est "Mes évènements"
         * @return : true si c'est ce filtre, false si ce n'est pas ce filtre
         */
        myEventDisabled() {
            if (this.filter === "Mes évènements") {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        /**
         * Méthode permettant de récupèrer les données des évènements et les affiche.
         * @return : vide
         */
        async GetEventData() {
            try {
                const link = this.apiLink+"/Participants/user/" + this.userUid;

                const res = await axios.get(link, {
                    headers: { Authorization: `Bearer ${this.userToken}` }
                })

                this.events = res.data;

                const linkCreatedByUser = this.apiLink+"/event/getEventByUser/" + this.userUid;
                const resCreatedByUser = await axios.get(linkCreatedByUser, {
                    headers: { Authorization: `Bearer ${this.userToken}` }
                })

                this.eventCreatedByUser = resCreatedByUser.data.events;
            } catch (error) {
                if (error.response.status === 401) {
                    this.$store.commit('deconnect', 'Votre session a expiré, veuillez vous reconnecter.');
                    sessionStorage.removeItem('account');
                    this.$router.push({ name: 'SignIn' });
                }
                //TODO Gestion d'erreur
            }
        },

        /**
         * Méthode permettant d'accèder à la page de visualisation d'un évènement.
         * @param {*} id : Id de l'évènement
         */
        goToEvent(id) {
            this.$router.push({ name: 'Event', params: { id: id } });
        },

        /**
         * Méthode permettant d'accèder à la page de modification d'un évènement.
         * @param {*} id : Id de l'évènement
         */
        UpdateEvent(id) {
            this.$router.push({ name: 'UpdateEvent', params: { id: id } });
        },

        /**
         * Méthode permettant de définir le filtre des évènements.
         */
        setFilter(filter) {
            this.filter = filter;
        },

        /**
         * Méthode permettant de définir le status de l'utilisateur par rapport aux évènements.
         * @param {*} status 
         */
        showStatus(status) {
            if (status === "accepted") {
                return "text-success";
            } else if (status === "pending") {
                return "text-primary";
            } else {
                return "text-danger";
            }
        }
    },

    /**
     * Récupère les données de l'utilisateur connecté.
     * @return : vide
     */
    created() {
        let acc = JSON.parse(sessionStorage.getItem('account'));
        if (acc !== null) {
            this.userUid = acc.uid;
            this.userToken = acc.access_token;
            this.userRefresh = acc.refresh_token;
            this.GetEventData();
        }
    }
}
</script>

<style scoped></style>




