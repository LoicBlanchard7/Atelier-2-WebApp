<template>
    <NavBar />

    <div class="container">
        <div v-if="!isConnected">
            <h3>Réunionou</h3>
            <p>Bienvenue sur Réunionnou, veuillez vous connecté.</p>
        </div>
        <div v-else>
            <div class="btn-toolbar justify-content-center m-3 p-1" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-primary m-1" :disabled="allDisabled"
                    @click="setFilter('Tous')">Tous</button>
                <button type="button" class="btn btn-primary  m-1" :disabled="toComeDisabled"
                    @click="setFilter('A venir')">A venir</button>
                <button type="button" class="btn btn-primary  m-1" :disabled="pendingDisabled"
                    @click="setFilter('En attente')">En attente</button>
                <button type="button" class="btn btn-primary  m-1" :disabled="myEventDisabled"
                    @click="setFilter('Crée par moi')">Crée par moi</button>
            </div>

            <div class="card-group justify-content-center justify-content-xxl-start">

                <div v-for="event in eventCreatedByUserToShow" :key="event.eid" class="m-1">
                    <div class="card cardWidth h-100 card">
                        <div class="card-body cardBackground">
                            <h5 class="card-title">{{ event.title }}</h5>
                            <p class="card-text">{{ event.description }}</p>

                            <div class="btn-toolbar justify-content-center m-3 p-1" role="group" aria-label="Basic example">
                                <button class="btn btn-primary m-1" @click="goToEvent(event.eid)">Consulter</button>
                                <button class="btn btn-primary m-1" @click="UpdateEvent(event.eid)">Modifier</button>
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
                            <button class="btn btn-primary" @click="goToEvent(event.event.eid)">Consulter</button>
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
        isConnected() {
            let acc = JSON.parse(sessionStorage.getItem('account'));
            if (acc !== null) {
                return true;
            } else {
                return false;
            }
        },

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

        eventCreatedByUserToShow() {
            if (this.filter === "Crée par moi" || this.filter === "Tous") {
                return this.eventCreatedByUser;
            } else if (this.filter === "A venir") {
                return this.eventCreatedByUser.filter(event => new Date(event.date) > new Date());
            } else {
                return [];
            }
        },

        allDisabled() {
            if (this.filter === "Tous") {
                return true;
            } else {
                return false;
            }
        },

        toComeDisabled() {
            if (this.filter === "A venir") {
                return true;
            } else {
                return false;
            }
        },

        pendingDisabled() {
            if (this.filter === "En attente") {
                return true;
            } else {
                return false;
            }
        },

        myEventDisabled() {
            if (this.filter === "Crée par moi") {
                return true;
            } else {
                return false;
            }
        }


    },
    methods: {
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

        goToEvent(id) {
            this.$router.push({ name: 'Event', params: { id: id } });
        },

        UpdateEvent(id) {
            this.$router.push({ name: 'UpdateEvent', params: { id: id } });
        },

        setFilter(filter) {
            this.filter = filter;
        },

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




