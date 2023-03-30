<template>
      <NavBar/>

    <div class="container">
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
                            <div class="mb-3">
                                <label for="description" class="form-label">Description de l'événement</label>
                                <textarea class="form-control" id="form-control" rows="3" v-model="description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="lieu" class="form-label">Lieu</label>
                                <textarea class="form-control" id="form-control" rows="1" v-model="lieu"></textarea>
                            </div>
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
            <div class="col-md-6">
                <h2>Choisissez un point de rendez-vous</h2>

                <l-map ref="map" @ready="doSomethingOnReady()" class="map" v-model:center="center" v-model:zoom="zoom"
                    :max-zoom="maxZoom" :min-zoom="minZoom" :zoom-control="false">

                    <l-tile-layer :url="osmUrl" />

                    <l-marker v-for="marker in markers" :key="marker.id" :lat-lng="marker.coordinates" />

                </l-map>

            </div>
        </div>
    </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import NavBar from './NavBar.vue';

export default {
    name: 'CreateEvent',
    components: {
        NavBar,
        LMap,
        LTileLayer,
        LMarker,
    },

    data() {
        return {
            lieu: '',
            title: '',
            description: '',
            date: '',
            time: '',
            position: null,
            osmUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            center: [48.6937223, 6.1792289],
            zoom: 14,
            markers: [
                { id: 1, coordinates: [48.6964074, 6.1792289] },
                { id: 2, coordinates: [48.6844, 6.185] },
                { id: 3, coordinates: [48.6935244, 6.1832861] }
            ],
            minZoom: 0,
            maxZoom: 19,
            map: null,
            errorMessage: '',
            newAccountMessage: ''
        };
    },

    methods: {
        doSomethingOnReady() {
            this.map = this.$refs.map.mapObject // work as expected

            console.log(this.map);
        },

        createEvent() {
            if (this.title != '' && this.description != '' && this.lieu != '' && this.date != '' && this.time != '') {
                let event = {
                    title: this.title,
                    description: this.description,
                    lieu: this.lieu,
                    date: this.date,
                    time: this.time,
                };

                console.log(event);
                this.newAccountMessage = "Evènement créé.";
            } else {
                this.errorMessage = "Veuillez remplir les champs correctement.";
            }
        },

        resetForm() {
            this.title = '';
            this.description = '';
            this.lieu = '';
            this.date = '';
            this.time = '';
        }
    },
};
</script>
