<template>
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
            </div>
        </div>
    </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
    name: 'CreateEvent',
    components: {},

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
            newAccountMessage: ''
        };
    },

    mounted() {
        mapboxgl.accessToken = 'pk.eyJ1IjoibG9sb2F0ZWxpZXIiLCJhIjoiY2xmdjRqYXl3MDNvNzNjczZoY281cnhyayJ9.aE6a7BJ_XrBE8m9oWUAw7g';

        const map = new mapboxgl.Map({
            container: this.$refs.map,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [6.1792289, 48.6937223],
            zoom: 13,
        });

        // Ajouter un marqueur
        const marker = new mapboxgl.Marker().setLngLat([this.longitude, this.lattitude]).addTo(map);

        map.on('click', (event) => {
            const { lng, lat } = event.lngLat;
            this.lattitude = lat;
            this.longitude = lng;
            marker.setLngLat([this.longitude, this.lattitude]).addTo(map);
        });
    },

    methods: {
        createEvent() {
            if (this.title != '' && this.description != '' && this.lattitude != null && this.longitude != null && this.date != '' && this.time != '') {
                let event = {
                    title: this.title,
                    description: this.description,
                    date: this.date,
                    time: this.time,
                    posX: this.lattitude,
                    posY: this.longitude
                };

                console.log(event);
                this.errorMessage = '';
                this.newAccountMessage = "Evènement créé.";

                this.resetForm();
            } else {
                this.newAccountMessage = '';
                this.errorMessage = "Veuillez remplir les champs correctement ou ajouter un point sur la carte.";
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
