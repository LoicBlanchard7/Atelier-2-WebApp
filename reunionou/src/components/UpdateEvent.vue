<template>
    <NavBar />

    <div class="container">
        <div v-if="!isConnected">
            <h3>Réunionou</h3>
            <p>Bienvenue sur Réunionnou, veuillez vous connecté.</p>
        </div>
        <div v-else>
            <div class="row">
                <div class="col-md-6">
                    <div class="card mt-5">
                        <div class="card-header">
                            <h3 class="text-center">Modifier l'événement</h3>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="updateEvent">
                                <div class="mb-3">
                                    <label for="titleEvent" class="form-label">Titre de l'événement</label>
                                    <input type="text" class="form-control" id="titleEvent" v-model="this.titleEvent">
                                </div>
                                <small class="text-danger" v-if="this.titleEvent.length > 128">Le titre ne doit pas
                                    dépasser
                                    128 caractères.</small>
                                <div class="mb-3">
                                    <label for="descriptionEvent" class="form-label">Description de l'événement</label>
                                    <textarea class="form-control" id="form-control" rows="3"
                                        v-model="this.descriptionEvent"></textarea>
                                </div>
                                <small class="text-danger" v-if="this.descriptionEvent.length > 256">La description ne doit
                                    pas
                                    dépasser
                                    256 caractères.</small>
                                <div class="mb-3">
                                    <label for="dateEvent" class="form-label">Date de l'événement</label>
                                    <input type="dateEvent" class="form-control" id="dateEvent" v-model="this.dateEvent">
                                </div>
                                <div class="mb-3">
                                    <label for="timeEvent" class="form-label">Heure de l'événement</label>
                                    <input type="timeEvent" class="form-control" id="timeEvent" v-model="this.timeEvent">
                                </div>
                                <button type="submit" class="btn btn-primary">Modifier l'évènement</button>

                                <br />
                                <small class="errorMessage marginT">{{ this.errorMessage }}</small>
                                <small class="newAccountMessage marginT">{{ this.newAccountMessage }}</small>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 marginTMap">
                    <h2>Modifier le point de rendez-vous</h2>
                    <div ref="map" class="map"></div>
                    <form @submit.prevent="onSubmit">
                        <div class="mb-3">
                            <input type="text" class="form-control" id="address" v-model="address"
                                placeholder="Entrez une adresse">
                            <button type="submit" class="btn btn-primary">Modifier l'adresse</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>

<script>
import { format } from 'date-fns';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
import MapboxClient from '@mapbox/mapbox-sdk/services/geocoding';
import { inject } from 'vue';


export default {
    name: 'UpdateEvent',
    components: { NavBar, Footer },

    data() {
        return {
            titleEvent: '',
            descriptionEvent: '',
            dateEvent: '',
            timeEvent: '',
            posXEvent: '',
            posYEvent: '',

            errorMessage: '',
            newAccountMessage: '',
            marker: null,
            map: null,
            address: '',
            token: '',
            uid: '',
            apiLink : inject('apiLink'),
            event: [],
        };
    },

    /**
    * Récupère les données de l'évènement correspondant à l'id placé dans l'url.
    * Initialise la carte avec les données de l'évènement ainsi que les différents champs du formulaire.
    * @return : Vide
    */
    async created() {
        const acc = JSON.parse(sessionStorage.getItem('account'));
        this.token = acc.access_token;
        this.uid = acc.uid;

        try {
            const link = this.apiLink+`/event/getEvent/` + this.eid;

            const res = await axios.get(link, {
                headers: { Authorization: `Bearer ${this.token}` }
            });

            this.event = res.data.events;

            if (this.isAuthor()) {
                this.titleEvent = this.event.title;
                this.descriptionEvent = this.event.description;
                this.posXEvent = this.event.posX;
                this.posYEvent = this.event.posY;

                const dateEvent = this.event.date;

                this.timeEvent = format(new Date(dateEvent), 'HH:mm');
                this.dateEvent = format(new Date(dateEvent), 'yyyy-MM-dd');

                mapboxgl.accessToken = 'pk.eyJ1IjoibG9sb2F0ZWxpZXIiLCJhIjoiY2xmdjRqYXl3MDNvNzNjczZoY281cnhyayJ9.aE6a7BJ_XrBE8m9oWUAw7g';

                this.map = new mapboxgl.Map({
                    container: this.$refs.map,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [this.event.posY, this.event.posX],
                    zoom: 13,
                });

                this.marker = new mapboxgl.Marker().setLngLat([this.event.posY, this.event.posX]).addTo(this.map);

                this.map.on('click', (event) => {
                    const { lng, lat } = event.lngLat;
                    this.marker.setLngLat([lng, lat]).addTo(this.map);
                    this.posXEvent = lat;
                    this.posYEvent = lng;
                });
            } else {
                this.$router.push({ name: "Home" });
            }
        } catch (err) {
            this.newAccountMessage = "";
            this.errorMessage = "Une erreur est survenue.";
        }
    },

    computed: {
        /**
         * Méthode permettant de récupérer l'id de l'évènement placé en paramètre.
         * @return : L'id de l'évènement placé en paramètre
         */
        eid() { return this.$route.params.id },

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
    },

    methods: {
        /**
         * Méthode permettant de déterminer si l'utilisateur connecté est le créateur de l'évènement.
         * @return : true si l'utilisateur est l'auteur, false si l'utilisateur n'est pas l'auteur.
         */
        isAuthor() {
            if (this.uid == this.event.uid) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Méthode permettant de mettre à jour un évènement avec les données rentrées dans le formulaire de modification.
         * Si les champs ne sont pas bien remplis, une erreur s'affiche à l'écran.
         * Une fois l'évènement mis à jour, les champs sont remis à zéro et l'utilisateur est renvoyé sur la page d'accueil.
         * @return : vide
         */
        async updateEvent() {
            if (this.titleEvent != '' && this.descriptionEvent != '' && this.posXEvent != '' && this.posYEvent != '' && this.dateEvent != '' && this.timeEvent != '' && this.descriptionEvent.length < 257 && this.titleEvent.length < 129) {
                try {
                    await axios
                        .put(this.apiLink+`/event/updateEvent`, {
                            title: this.titleEvent,
                            description: this.descriptionEvent,
                            date: this.dateEvent.toString() + " " + this.timeEvent.toString(),
                            posX: this.posXEvent,
                            posY: this.posYEvent,
                            eid: this.eid,
                        }, {
                            headers: { Authorization: `Bearer ${this.token}` }
                        });

                    this.errorMessage = '';
                    this.newAccountMessage = "Évènement modifié.";
                    this.resetForm();
                    this.$router.push('/');
                } catch (err) {
                    this.newAccountMessage = "";
                    this.errorMessage = "Une erreur ?";
                }
            } else {
                this.newAccountMessage = '';
                this.errorMessage = "Veuillez remplir les champs correctement ou ajouter un point sur la carte.";
            }
        },

        /**
         * Méthode permettant d'ajouter le point de l'évènement à partir de l'adresse placé dans le champ.
         * Recentre la carte sur le point choisi. 
         * @return : vide
         */
        async addMarkerFromAddress(address) {
            const client = MapboxClient({ accessToken: 'pk.eyJ1IjoibG9sb2F0ZWxpZXIiLCJhIjoiY2xmdjRqYXl3MDNvNzNjczZoY281cnhyayJ9.aE6a7BJ_XrBE8m9oWUAw7g' });

            const response = await client.forwardGeocode({
                query: address,
                limit: 1,
            }).send();

            const { center } = response.body.features[0];

            if (!this.marker) {
                this.marker = new mapboxgl.Marker().setLngLat(center).addTo(this.map);
                this.posXEvent = center[1];
                this.posYEvent = center[0];
            } else {
                this.marker.setLngLat(center);
                this.posXEvent = center[1];
                this.posYEvent = center[0];
            }

            this.map.flyTo({ center });
        },

        /**
         * Méthode permettant d'appeler la méthode d'ajout du point de rendez-vous de l'évènement à partir de l'adresse placé dans le champ.
         * Appele la méthode si le champ n'est pas vide.
         * @return : vide
         */
        onSubmit() {
            if (this.address != '') {
                this.addMarkerFromAddress(this.address);
            }
        },

        /**
         * Méthode permettant de remettre à zéro le formulaire de modification d'évènement.
         * @return : vide
         */
        resetForm() {
            this.titleEvent = '';
            this.descriptionEvent = '';
            this.dateEvent = '';
            this.timeEvent = '';
            this.lattitude = null;
            this.longitude = null;
        }
    },
};
</script>
