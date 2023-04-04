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
                            <h3 class="text-center">Créer un événement</h3>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="createEvent">
                                <div class="mb-3">
                                    <label for="title" class="form-label">Titre de l'événement</label>
                                    <input type="text" class="form-control" id="title" v-model="title">
                                </div>
                                <small class="text-danger" v-if="this.title.length > 128">Le titre ne doit pas
                                        dépasser
                                        128 caractères.</small>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description de l'événement</label>
                                    <textarea class="form-control" id="form-control" rows="3"
                                        v-model="description"></textarea>
                                </div>
                                <small class="text-danger" v-if="this.description.length > 256">La description ne doit pas
                                        dépasser
                                        256 caractères.</small>
                                <div class="mb-3">
                                    <label for="date" class="form-label">Date de l'événement</label>
                                    <input type="date" class="form-control" id="date" v-model="date">
                                </div>
                                <div class="mb-3">
                                    <label for="time" class="form-label">Heure de l'événement</label>
                                    <input type="time" class="form-control" id="time" v-model="time">
                                </div>
                                <button type="submit" class="btn btn-primary">Créer</button>

                                <br />
                                <small class="errorMessage marginT">{{ this.errorMessage }}</small>
                                <small class="newAccountMessage marginT">{{ this.newAccountMessage }}</small>

                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 marginTMap">
                    <h2>Choisissez un point de rendez-vous</h2>
                    <div ref="map" class="map"></div>
                    <form @submit.prevent="onSubmit">
                        <div class="mb-3">
                            <input type="text" class="form-control" id="address" v-model="address"
                                placeholder="Entrez une adresse">
                            <button type="submit" class="btn btn-primary">Ajouter une adresse</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>

<script>
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
import MapboxClient from '@mapbox/mapbox-sdk/services/geocoding';
import { inject} from 'vue';

export default {
    name: 'CreateEvent',
    components: { NavBar, Footer },

    data() {
        return {
            lieu: '',
            title: '',
            description: '',
            date: '',
            time: '',
            lattitude: null,
            longitude: null,
            errorMessage: '',
            newAccountMessage: '',
            marker: null,
            address: '',
            apiLink : inject('apiLink')
        };
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
        }
    },

    /**
     * Permet d'instancier la carte.
     * @return : vide
     */
    mounted() {
        mapboxgl.accessToken = 'pk.eyJ1IjoibG9sb2F0ZWxpZXIiLCJhIjoiY2xmdjRqYXl3MDNvNzNjczZoY281cnhyayJ9.aE6a7BJ_XrBE8m9oWUAw7g';

        this.map = new mapboxgl.Map({
            container: this.$refs.map,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [6.1792289, 48.6937223],
            zoom: 13,
        });

        this.marker = new mapboxgl.Marker().setLngLat([this.longitude, this.lattitude]).addTo(this.map);

        this.map.on('click', (event) => {
            const { lng, lat } = event.lngLat;
            this.lattitude = lat;
            this.longitude = lng;
            this.marker.setLngLat([this.longitude, this.lattitude]).addTo(this.map);
        });
    },

    methods: {
        /**
         * Méthode permettant de créer un nouvel évènement avec les données du formulaire.
         * @return : vide
         */
        async createEvent() {
            if (this.title != '' && this.description != '' && this.lattitude != null && this.longitude != null && this.date != '' && this.time != '' && this.description.length < 257 && this.title.length < 129) {
                let acc = JSON.parse(sessionStorage.getItem('account'));

                try {
                    await axios
                        .post(this.apiLink+`/event/createEvent`, {
                            title: this.title,
                            description: this.description,
                            date: this.date.toString() + " " + this.time.toString(),
                            posX: this.lattitude,
                            posY: this.longitude,
                            uid: acc.uid,
                        }, {
                            headers: { Authorization: `Bearer ${acc.access_token}` }
                        });

                    this.errorMessage = '';
                    this.newAccountMessage = "Evènement créé.";
                    this.resetForm();

                    this.$router.push('/');

                } catch (err) {
                    console.log(err);
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
                this.lattitude = center[1];
                this.longitude = center[0];
            } else {
                this.marker.setLngLat(center);
                this.lattitude = center[1];
                this.longitude = center[0];
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
            this.title = '';
            this.description = '';
            this.date = '';
            this.time = '';
            this.lattitude = null;
            this.longitude = null;
        }
    },
};
</script>