<template>
    <NavBar />

    <div class="container">
        <div v-if="!isConnected">
            <h3>Réunionou</h3>
            <p>Bienvenue sur Réunionnou, veuillez vous connecté.</p>
        </div>
        <div v-else>
            <div class="row marginTMap">
                <div class="col-md-6">
                    <div class="col-md-12">
                        <h3 class="text-center text-muted">{{ this.event.title }}</h3>
                        <p><strong>Auteur -</strong> {{ this.userName + " " + this.userFirstname }}</p>
                        <p><strong>Mail -</strong> {{ this.userMail}}</p>

                        <p class="text-muted">{{ new Date(this.event.date).toLocaleDateString('fr-FR', {
                            weekday: "long",
                            year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric"
                        })
                        }}</p>

                        <div class="overflow-auto" style="max-height: 6rem;">
                            <p>{{ this.event.description }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="col-md-12">
                        <h3 class="text-center">Lieu de rendez-vous</h3>
                        <div ref="map" class="map"></div>
                    </div>
                </div>
            </div>

            <div class="row marginTMap">
                <div class="col-md-6">
                    <div class="col-md-12">
                        <div class="card width100" style="max-height: 20rem; min-height: 20rem;">
                            <div class="card-header">
                                <strong>Chat</strong>
                            </div>
                            <div class="card-body overflow-auto text-right">
                                <div v-for="comment in comments" :key="comment.id">
                                    <strong>{{ comment.name + " " + comment.firstname }} :</strong> {{ comment.content }}
                                </div>
                            </div>
                            <div class="card-footer">
                                <form @submit.prevent="sendMessage">
                                    <div class="input-group">
                                        <input type="text" class="form-control" v-model="newMessage"
                                            placeholder="Ecrire un commentaire ...">
                                        <button type="submit" class="btn btn-primary">Envoyer</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="col-md-12">
                        <div class="card width100" style="max-height: 20rem; min-height: 20rem;">
                            <div class="card-header">
                                <strong>Participants</strong>
                            </div>
                            <div class="card-body overflow-auto">
                                <div v-for="participant in participants" :key="participant.uid">
                                    <strong
                                        :class="{ 'text-success': participant.status === 'accepted', 'text-danger': participant.status === 'declined', 'text-info': participant.status === 'pending' }">{{
                                            participant.status }} </strong> : {{ participant.name + " " +
        participant.firstname }}
                                </div>
                            </div>
                            <div class="card-footer" v-if="!isAuthor">
                                <div class="input-group row widthAuto">
                                    <div class="col-md-6">
                                        <button v-on:click="acceptEvent" class="btn btn-success col-12">Accepter</button>
                                    </div>
                                    <div class="col-md-6">
                                        <button v-on:click="deniedEvent" class="btn btn-danger col-12">Refuser</button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer" v-else>
                                <div class="input-group row widthAuto">
                                    <p>
                                        <strong>Sélection d'un membre</strong>
                                    </p>
                                    <select class="select" size="4" v-model="newParticipant">
                                        <option v-for="participant in allParticipants" :key="participant.id"
                                            :value=participant>
                                            {{ participant.name + " " + participant.firstname }}
                                        </option>
                                    </select>
                                    <div class="input-group">
                                        <button v-on:click="addParticipant" type="submit"
                                            class="btn btn-primary col-12">Ajouter</button>
                                    </div>
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
import axios from 'axios';
import NavBar from './NavBar.vue';
import mapboxgl from 'mapbox-gl';
import Footer from './Footer.vue';

export default {
    name: 'EventPage',
    components: { NavBar, Footer },

    data() {
        return {
            comments: [],
            participants: [],
            newMessage: '',
            newParticipant: '',
            event: [],
            userToken: "",
            userUid: "",
            userName: "",
            userMail: "",
            userFirstname: "",
            allParticipants: [],
            longitude: "6.1792289",
            lattitude: "48.6937223",
            marker: null,
            map: null,
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

        eid() { return this.$route.params.id },


        isAuthor() {
            if (this.userUid == this.event.uid) {
                return true;
            } else {
                return false;
            }
        }
    },

    created() {
        let acc = JSON.parse(sessionStorage.getItem('account'));
        if (acc !== null) {
            this.userToken = acc.access_token;
            this.userUid = acc.uid;
            this.initUserInfo(this.userUid);

            this.initEvent();
            this.initParticipants();
            this.initComments();
            this.initAllParticipants();
        }
    },

    methods: {
        async initEvent() {
            try {
                const link = `http://iut.netlor.fr/event/getEvent/` + this.eid;

                const res = await axios.get(link, {
                    headers: { Authorization: `Bearer ${this.userToken}` }
                });

                this.event = res.data.events;

                mapboxgl.accessToken = 'pk.eyJ1IjoibG9sb2F0ZWxpZXIiLCJhIjoiY2xmdjRqYXl3MDNvNzNjczZoY281cnhyayJ9.aE6a7BJ_XrBE8m9oWUAw7g';

                this.map = new mapboxgl.Map({
                    container: this.$refs.map,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [this.event.posY, this.event.posX],
                    zoom: 13,
                });

                this.marker = new mapboxgl.Marker().setLngLat([this.event.posY, this.event.posX]).addTo(this.map);

            } catch (err) {
                console.log(err);
            }
        },

        async initParticipants() {
            try {
                const link = `http://iut.netlor.fr/participants/event/` + this.eid;

                const res = await axios.get(link, {
                    headers: { Authorization: `Bearer ${this.userToken}` }
                });

                if (res.data.participants.length > 0) {
                    this.participants = res.data.participants;
                }

            } catch (err) {
                console.log(err);
            }
        },

        async initComments() {
            try {
                const link = `http://iut.netlor.fr/participants/comment/` + this.eid;

                const res = await axios.get(link, {
                    headers: { Authorization: `Bearer ${this.userToken}` }
                });

                if (res.data.comments.length > 0) {
                    this.comments = res.data.comments;
                }

            } catch (err) {
                console.log(err);
            }
        },

        async initAllParticipants() {
            try {
                const link = `http://iut.netlor.fr/auth/`;

                const res = await axios.get(link, {
                    headers: { Authorization: `Bearer ${this.userToken}` }
                });

                if (res.data.users.length > 0) {
                    this.allParticipants = res.data.users;
                }

            } catch (err) {
                console.log(err);
            }
        },
        async initUserInfo(uid){
            try {
                const user = await axios
                    .get(`http://iut.netlor.fr/auth/userId/`+uid);
                this.userFirstname = user.data.user.firstname;
                this.userName = user.data.user.name;
                this.userMail = user.data.user.email;
                
            } catch (err) {
                console.log(err);
            }
        },

        async sendMessage() {
            if (this.newMessage !== '') {
                try {
                    const link = ` http://iut.netlor.fr/Participants/comment/add`;

                    await axios
                        .post(link, {
                            uid: this.userUid,
                            name: this.userName,
                            firstname: this.userFirstname,
                            eid: this.eid,
                            content: this.newMessage,
                        });

                    this.initComments();

                } catch (err) {
                    console.log(err);
                }
            }
        },

        async addParticipant() {
            if (this.newParticipant !== '') {
                try {
                    const link = ` http://iut.netlor.fr/participants/add`;

                    await axios
                        .post(link, {
                            uid: this.newParticipant.uid,
                            eid: this.eid,
                            name: this.newParticipant.name,
                            firstname: this.newParticipant.firstname,
                        }, {
                            headers: { Authorization: `Bearer ${this.userToken}` }
                        });

                    this.initParticipants();
                } catch (err) {
                    console.log(err);
                }
            }
        },

        async acceptEvent() {
            try {
                const link = `http://iut.netlor.fr/Participants/accept`;

                await axios
                    .put(link, {
                        uid: this.userUid,
                        eid: this.eid,
                        status: "accepted",
                    }, {
                        headers: { Authorization: `Bearer ${this.userToken}` }
                    });

                this.initParticipants();
            } catch (err) {
                console.log(err);
            }

        },

        async deniedEvent() {
            try {
                const link = `http://iut.netlor.fr/Participants/accept`;

                await axios
                    .put(link, {
                        uid: this.userUid,
                        eid: this.eid,
                        status: "declined",
                    }, {
                        headers: { Authorization: `Bearer ${this.userToken}` }
                    });

                this.initParticipants();
            } catch (err) {
                console.log(err);
            }
        }
    }

};
</script>
  