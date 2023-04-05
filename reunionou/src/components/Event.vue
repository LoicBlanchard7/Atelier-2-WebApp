<template>
    <NavBar />

    <div class="container">
        <div>
            <div class="row marginTMap">
                <div class="col-md-6">
                    <div class="col-md-12">
                        <h3 class="text-center text-muted">{{ this.event.title }}</h3>
                        <p><strong>Auteur -</strong> {{ this.authorName + " " + this.authorFirstname }}</p>
                        <p><strong>Mail -</strong> {{ this.authorMail }}</p>

                        <p class="text-muted">{{ new Date(this.event.date).toLocaleDateString('fr-FR', { timeZone: 'UTC',
                            weekday: "long",
                            year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric"
                        })
                        }}</p>

                        <div class="overflow-auto" style="max-height: 6rem;">
                            <p>{{ this.event.description }}</p>
                        </div>

                        <p>
                            <i v-if="parseFloat(forecastTemperature) < 0" class="bi bi-thermometer-snow"></i>
                            <i v-else-if="parseFloat(forecastTemperature) >= 0 & parseFloat(forecastTemperature) < 5"
                                class="bi bi-thermometer"></i>
                            <i v-else-if="parseFloat(forecastTemperature) >= 5 & parseFloat(forecastTemperature) < 10"
                                class="bi bi-thermometer-low"></i>
                            <i v-else-if="parseFloat(forecastTemperature) >= 10 & parseFloat(forecastTemperature) < 15"
                                class="bi bi-thermometer-half"></i>
                            <i v-else-if="parseFloat(forecastTemperature) >= 15 & parseFloat(forecastTemperature) < 20"
                                class="bi bi-thermometer-high"></i>
                            <i v-else-if="parseFloat(forecastTemperature) >= 20" class="bi bi-thermometer-sun"></i>
                            <i v-else class="bi bi-thermometer"></i>
                            :
                            {{ forecastTemperature }}
                        </p>
                        <p> <i class="bi bi-wind"></i> : {{ forecastWindSpeed }}</p>
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
                                <form @submit.prevent="sendMessage(this.newMessage)">
                                    <div class="input-group">
                                        <input type="text" class="form-control" v-model="newMessage"
                                            placeholder="Ecrire un commentaire ...">
                                        <button type="submit" class="btn btn-primary">Envoyer <i
                                                class="bi bi-send-fill"></i></button>
                                    </div>
                                    <small class="text-danger" v-if="this.newMessage.length > 256">Le commentaire ne doit
                                        pas
                                        dépasser
                                        256 caractères.</small>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col">
                    <div class="col-md-12" style="max-height: 20rem; min-height: 20rem;">
                        <div class="card width100" :class="[isAuthor ? cardEventAuthor : cardEventParticipant]">
                            <div class="card-header">
                                <strong>Participants</strong>
                            </div>
                            <div class="card-body overflow-auto">
                                <div v-for="participant in             participants" :key="participant.uid">
                                    <strong
                                        :class="{ 'text-success': participant.status === 'accepted', 'text-danger': participant.status === 'declined', 'text-info': participant.status === 'pending' }">{{
                                            participant.status }} </strong> : {{ participant.name + " " + participant.firstname
    }}
                                </div>
                            </div>
                            <div class="card-footer" v-if="!isAuthor">
                                <input type="text" class="form-control" v-model="acceptMessage"
                                    placeholder="Ecrire un commentaire ...">

                                <div class="input-group row widthAuto">
                                    <div class="col-md-6">
                                        <button v-on:click="acceptEvent" class="btn btn-success col-12"><i
                                                class="bi bi-check-lg"></i></button>
                                    </div>
                                    <div class="col-md-6">
                                        <button v-on:click="deniedEvent" class="btn btn-danger col-12"><i
                                                class="bi bi-x-lg"></i></button>
                                    </div>
                                </div>

                                <small class="text-danger" v-if="this.acceptMessage.length > 256">Le commentaire ne doit pas
                                    dépasser
                                    256 caractères.</small>
                            </div>
                        </div>

                        <div class="card width100" :class="[isAuthor ? cardEventAuthor : cardEventParticipant]"
                            v-if="isAuthor">
                            <div class="input-group row">
                                <div class="card-header">
                                    <strong>Sélection d'un membre</strong>
                                </div>
                                <select class="select card-text" size="4" v-model="newParticipant">
                                    <option v-for="participant in             this.sortAllParticipants"
                                        :key="participant.id" :value=participant>
                                        {{ participant.name + " " + participant.firstname }}
                                    </option>
                                </select>
                                <button v-on:click="addParticipant" type="submit"
                                    class="btn btn-primary addButton col-12"><i class="bi bi-plus-circle"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isAuthor" class="input-group m-3">
                <span class="input-group-text">Lien de partage : <i class="bi bi-link-45deg"></i> </span>
                <input type="text" class="form-control" ref="clone" :value="link" disabled>
                <button type="submit" class="btn btn-primary" @click="copy()"><i class="bi bi-clipboard"></i></button>
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
import { inject } from 'vue';

export default {
    name: 'EventPage',
    components: { NavBar, Footer },

    data() {
        return {
            acceptMessage: '',
            comments: [],
            participants: [],
            newMessage: '',
            newParticipant: '',
            event: [],
            eventUid: '',
            userToken: '',
            userUid: '',
            authorMail: '',
            userName: '',
            userFirstname: '',
            authorName: '',
            authorFirstname: '',
            allParticipants: [],
            longitude: "6.1792289",
            lattitude: "48.6937223",
            marker: null,
            map: null,
            cardEventAuthor: "cardEventAuthor",
            cardEventParticipant: "cardEventParticipant",
            apiLink: inject('apiLink'),
            forecastTemperature: '',
            forecastWindSpeed: '',
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


        sortAllParticipants() {
            let sortAllParticipants = this.allParticipants.filter(objet1 =>
            !this.participants.some(objet2 => objet2.uid === objet1.uid)
            );

            return sortAllParticipants;
        },

        /**
         * Méthode permettant de récupérer l'id de l'évènement placé en paramètre.
         * @return : L'id de l'évènement placé en paramètre
         */
        eid() { return this.$route.params.id },

        /**
         * Méthode permettant de déterminer si l'utilisateur connecté est le créateur de l'évènement.
         * @return : true si l'utilisateur est l'auteur, false si l'utilisateur n'est pas l'auteur.
         */
        isAuthor() {
            if (this.userUid == this.event.uid) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Méthode permettant de renvoyer le lien de partage de l'événement
         * @return : Lien de partage de l'évènement
         */
        link() { return "https://webetu.iutnc.univ-lorraine.fr/www/leblanc71u/atelier2/partage/event/" + this.eid },
    },

    /**
     * Récupère les données de l'utilisateur connecté.
     * @return: vide
     */
    created() {
        let acc = JSON.parse(sessionStorage.getItem('account'));
        let participants = JSON.parse(sessionStorage.getItem('participantsUid'));

        this.initEvent();
        this.initParticipants();
        this.initComments();

        if (acc !== null) {
            this.userToken = acc.access_token;
            this.userUid = acc.uid;
            this.initUserInfo(this.userUid);
            this.initAllParticipants();

        } else if (participants !== null) {
            this.initParticipantsInfo();

        } else {
            this.$router.push({ name: 'Home' });
        }
    },

    methods: {
        /**
         * Méthode permettant de récupérer les données de l'évènement afin de les afficher.
         * Instancie la carte avec le point de rendez-vous de l'évènement.
         * @return : vide
         */
        async initEvent() {
            try {
                const link = this.apiLink + `/event/getEvent/` + this.eid;

                const res = await axios.get(link);

                this.event = res.data.events;
                this.eventUid = this.event.uid;

                const diffTime = Math.abs(new Date(this.event.date) - new Date());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                axios.get(`https://api.open-meteo.com/v1/meteofrance?latitude=${this.event.posX}&longitude=${this.event.posY}&date=${this.event.date}&current_weather=true`)
                    .then(response => {
                        this.forecastTemperature = response.data.current_weather.temperature + "°";
                        this.forecastWindSpeed = response.data.current_weather.windspeed + " km/h";

                        if (diffDays > 10) {
                            this.forecastTemperature += " Prévision peu fiable.";
                            this.forecastWindSpeed += " Prévision peu fiable.";
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });

                this.initAuthorInfo(this.eventUid);

                mapboxgl.accessToken = 'pk.eyJ1IjoibG9sb2F0ZWxpZXIiLCJhIjoiY2xmdjRqYXl3MDNvNzNjczZoY281cnhyayJ9.aE6a7BJ_XrBE8m9oWUAw7g';

                this.map = new mapboxgl.Map({
                    container: this.$refs.map,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [this.event.posY, this.event.posX],
                    zoom: 13,
                });

                const popupEvent = new mapboxgl.Popup({ offset: 25 }).setText(
                    "Lieu de l'évènement"
                );

                this.marker = new mapboxgl.Marker().setLngLat([this.event.posY, this.event.posX]).setPopup(popupEvent).addTo(this.map);

                this.map.on('load', () => {
                    this.map.addSource('poi-source', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [],
                        },
                    });

                    const source = this.map.getSource('poi-source');
                    if (source) {
                        source.setData(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.event.posY},${this.event.posX}.json?access_token=${mapboxgl.accessToken}&proximity=${this.event.posY},${this.event.posX}&radius=${this.searchRadius}`
                        );
                    }

                    this.map.addLayer({
                        id: 'poi-layer',
                        type: 'symbol',
                        source: 'poi-source',
                        layout: {
                            'icon-image': 'monument-15',
                            'icon-size': 1.5,
                        },
                    });
                });

            } catch (err) {
                this.$router.push({ name: 'Home' });
            }
        },

        /**
         * Méthode permettant d'ajouter les participants invités à l'évènement à la liste des participants invités.
         * @return : vide
         */
        async initParticipants() {
            try {
                const link = this.apiLink + `/participants/event/` + this.eid;

                const res = await axios.get(link);

                if (res.data.participants.length > 0) {
                    this.participants = res.data.participants;
                }
            } catch (err) {
                console.log(err);
            }
        },

        /**
         * Méthode permettant de récupérer tous les commentaires d'un évènement.
         * @return : vide
         */
        async initComments() {
            try {
                const link = this.apiLink + `/participants/comment/getComment/` + this.eid;

                const res = await axios.get(link);

                if (res.data.comments.length > 0) {
                    this.comments = res.data.comments;
                }

            } catch (err) {
                console.log(err);
            }
        },

        /**
         * Méthode permettant de récupérer tous les participants.
         * @return : vide
         */
        async initAllParticipants() {
            try {
                const link = this.apiLink + `/auth/`;

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

        /**
         * Méthode permettant de récupérer les données de l'auteur de l'évènement.
         * @param {*} uid : Uid de l'auteur de l'évènement
         * @return : vide
         */
        async initAuthorInfo(uid) {
            try {
                const user = await axios
                    .get(this.apiLink + `/auth/userId/` + uid);
                this.authorFirstname = user.data.user.firstname;
                this.authorName = user.data.user.name;
                this.authorMail = user.data.user.email;

            } catch (err) {
                console.log(err);
            }
        },

        /**
         * Méthode permettant de récupérer les données de l'utilisateur connecté.
         * @param {*} uid : Uid de l'utilisateur connecté.
         * @return : vide
         */
        async initUserInfo(uid) {
            try {
                const user = await axios
                    .get(this.apiLink + `/auth/userId/` + uid);
                this.userFirstname = user.data.user.firstname;
                this.userName = user.data.user.name;
            } catch (err) {
                console.log(err);
            }
        },

        /**
         * Méthode permettant de récupérer les données des participants.
         * @return : vide
         */
        async initParticipantsInfo() {
            try {
                let uuid = JSON.parse(sessionStorage.getItem('participantsUid'));
                const participants = await axios
                    .get(this.apiLink + `/participants/getParticipant/` + uuid);
                this.userFirstname = participants.data.participants[0].firstname;
                this.userName = participants.data.participants[0].name;
                this.userUid = participants.data.participants[0].uid;
            } catch (err) {
                console.log(err);
            }
        },

        /**
         * Méthode permettant d'envoyer un commentaire.
         * @param {*} message : Message à envoyer
         * @return : vide
         */
        async sendMessage(message) {
            if (message !== '' && message.length < 257) {
                try {
                    const link = this.apiLink + `/Participants/comment/add`;

                    await axios
                        .post(link, {
                            uid: this.userUid,
                            name: this.userName,
                            firstname: this.userFirstname,
                            eid: this.eid,
                            content: message,
                        });

                    this.newMessage = "";

                    this.initComments();

                } catch (err) {
                    console.log(err);
                }
            }
        },

        /**
         * Méthode permettant d'ajouter un participant à un évènement à partir de la liste de tous les évènements.
         * @return : vide
         */
        async addParticipant() {
            if (this.newParticipant !== '') {
                try {
                    const link = this.apiLink + `/participants/add`;

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

        /**
         * Méthode permettant d'accepter l'invitation à un évènement.
         * @return : vide
         */
        async acceptEvent() {
            try {
                const link = this.apiLink + `/Participants/accept`;
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

            if (this.acceptMessage != '') {
                this.sendMessage("Accepte l'invitation. Message : " + this.acceptMessage);
                this.acceptMessage = "";
            }
        },

        /**
         * Méthode permettant de refuser l'invitation à un évènement.
         * @return : vide
         */
        async deniedEvent() {
            try {
                const link = this.apiLink + `/Participants/accept`;

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

            if (this.acceptMessage != '') {
                this.sendMessage("Refuse l'invitation. Message : " + this.acceptMessage);
                this.acceptMessage = "";
            }

        },

        /**
         * Méthode permettant de copier le lien de partage de l'évènement.
         * Affiche une alerte dans le navigateur lors de la copie.
         * @return : vide
         */
        copy() {
            navigator.clipboard.writeText(this.link);
            alert("Le lien a bien été copiée: " + this.link);
        }
    }
};
</script>
  