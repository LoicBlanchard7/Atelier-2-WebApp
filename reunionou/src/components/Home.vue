<template>
      <NavBar/>

    <div class="container">
        <div v-if="!isConnected">
            <h3>Réunionou</h3>
            <p>Bienvenue sur Réunionnou, veuillez vous connecté.</p>
        </div>
        <div v-else>
            <div class="card-group">
                <div v-for="event in eventCreatedByUser" :key="event.eid">
                    <div class="card m-1 cardminWidth cardHeight">
                        <div class="card-body ">
                        <h5 class="card-title">{{ event.Title }}</h5>
                        <p class="card-text">{{ event.description }}</p>
                        <p class="card-text lign-text-bottom"><small class="text-muted">{{new Date(event.date).toLocaleDateString('fr-FR', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) }}</small></p>
                        </div>
                    </div>
                </div>

                <div v-for = "events in event" :key="events.eid">
                     <div class="card m-1 cardminWidth cardHeight">
                        <div class="card-body">
                        <h5 class="card-title">{{ events.event.Title }}</h5>
                        <p class="card-text">{{ events.event.description }}</p>
                        <p class = "card-text">Créateur : {{ events.creator }}</p>
                        <p class="card-text lign-text-bottom"><small class="text-muted">{{new Date(events.event.date).toLocaleDateString('fr-FR', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) }}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <Footer/>
</template>
<script>
import "../../scss/custom.scss";
import NavBar from './NavBar.vue';
import axios from 'axios';
import Footer from './Footer.vue';
export default {
    name: 'HomePage',
    components: {NavBar,Footer},
    data() {
        return {
            userUid: "",
            userToken: "",
            userRefresh: "",
            numbers : [1,2,3,4,5,6,7,8,9,10],
            event : [],
            eventCreatedByUser : [],
            eventParticipate : [],
            eventPending : [],
            
        }
    },
    computed: {
        isConnected() {
            let acc = JSON.parse(sessionStorage.getItem('account'));
            if(acc !== null){
                return true;
            }else{
                return false;
            }
        }
    },
    methods: {
        async GetEventData(){
            try {
                const link = "http://iut.netlor.fr/Participants/user/"+ this.userUid ;

                const res = await axios.get(link,{
                    headers: { Authorization: `Bearer ${this.userToken}` }
                })

                this.event = res.data;

                if(this.event.length > 0){
                    this.eventPending = this.event.filter(events => events.status === "pending");
                    this.eventParticipate = this.event.filter(event => event.uid !== this.uid);
                }

                const linkCreatedByUser = "http://iut.netlor.fr/event/getEventByUser/"+ this.userUid ;
                const resCreatedByUser = await axios.get(linkCreatedByUser,{
                    headers: { Authorization: `Bearer ${this.userToken}` }
                })

                this.eventCreatedByUser = resCreatedByUser.data.events;
            }catch(error){
                if(error.response.status === 401){
                    this.$store.commit('deconnect', 'Votre session a expiré, veuillez vous reconnecter.');
                    sessionStorage.removeItem('account');
                    this.$router.push({name: 'SignIn'});
                } 
            }
        },

    },
    created(){
        let acc = JSON.parse(sessionStorage.getItem('account'));
        if(acc !== null){
            this.userUid = acc.uid;
            this.userToken = acc.access_token;
            this.userRefresh = acc.refresh_token;
            this.GetEventData();
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
