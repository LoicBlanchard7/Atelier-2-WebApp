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
                                    <label for="title" class="form-label">Titre de l'événement</label>
                                    <input type="text" class="form-control" id="title" v-model="this.title">
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description de l'événement</label>
                                    <textarea class="form-control" id="form-control" rows="3"
                                        v-model="this.description"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="date" class="form-label">Date de l'événement</label>
                                    <input type="date" class="form-control" id="date" v-model="this.date">
                                </div>
                                <div class="mb-3">
                                    <label for="time" class="form-label">Heure de l'événement</label>
                                    <input type="time" class="form-control" id="time" v-model="this.time">
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
            lieu: '',
            title: '',
            description: '',
            date: '',
            time: '',
            errorMessage: '',
            newAccountMessage: '',
            marker: null,
            map: null,
            address: '',
            token: '',
            event: [],
            posX: '',
            posY: '',
            uid: '',
            apiLink : inject('apiLink'),
        };
    },

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
                this.title = this.event.title;
                this.description = this.event.description;
                this.posX = this.event.posX;
                this.posY = this.event.posY;

                const dateEvent = this.event.date;

                this.time = format(new Date(dateEvent), 'HH:mm');
                this.date = format(new Date(dateEvent), 'yyyy-MM-dd');

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
                });
            } else {
                this.$router.push({ name: "Home" });
            }


        } catch (err) {
            console.log(err);
            this.newAccountMessage = "";
            this.errorMessage = "Une erreur ?";
        }
    },

    computed: {
        eid() { return this.$route.params.id },

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
        isAuthor() {
            if (this.uid == this.event.uid) {
                return true;
            } else {
                return false;
            }
        },

        async updateEvent() {
            if (this.title != '' && this.description != '' && this.posX != '' && this.posY != '' && this.date != '' && this.time != '') {
                try {
                    await axios
                        .put(this.apiLink+`/event/updateEvent`, {
                            title: this.title,
                            description: this.description,
                            date: this.date.toString() + " " + this.time.toString(),
                            posX: this.posX,
                            posY: this.posY,
                            eid: this.eid,
                        }, {
                            headers: { Authorization: `Bearer ${this.token}` }
                        });

                    this.errorMessage = '';
                    this.newAccountMessage = "Evènement modifié.";
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

        async addMarkerFromAddress(address) {

            const client = MapboxClient({ accessToken: 'pk.eyJ1IjoibG9sb2F0ZWxpZXIiLCJhIjoiY2xmdjRqYXl3MDNvNzNjczZoY281cnhyayJ9.aE6a7BJ_XrBE8m9oWUAw7g' });

            const response = await client.forwardGeocode({
                query: address,
                limit: 1,
            }).send();

            const { center } = response.body.features[0];

            if (!this.marker) {
                this.marker = new mapboxgl.Marker().setLngLat(center).addTo(this.map);
                this.posX = center[1];
                this.posY = center[0];
            } else {
                this.marker.setLngLat(center);
                this.posX = center[1];
                this.posY = center[0];
            }

            this.map.flyTo({ center });
        },

        onSubmit() {
            if (this.address != '') {
                this.addMarkerFromAddress(this.address);
            }
        },

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
