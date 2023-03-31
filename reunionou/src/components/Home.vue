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
                    <div class="card m-1 cardminWidth h-100">
                        <div class="card-body ">
                        <h5 class="card-title">{{ event.title }}</h5>
                        <p class="card-text">{{ event.description }}</p>
                        <button class="btn btn-primary" @click="EventModifier(event.eid)">Modifier</button>
                        </div>
                        <div class="card-footer"><small class="text-muted">{{new Date(event.date).toLocaleDateString('fr-FR', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) }}</small></div>
                    </div>
                </div>

                <div v-for = "event in events" :key="event.eid">
                     <div class="card m-1 cardminWidth h-100">
                        <div class="card-body">
                        <h5 class="card-title">{{ event.event.title }}</h5>
                        <p class="card-text">{{ event.event.description }}</p>
                        <p class = "card-text">Créateur : {{ event.creator }}</p>
                        <button class="btn btn-primary" @click="EventModifier(event.event.eid)">Consulter</button>
                        </div>
                        <div class="card-footer"><small class="text-muted">{{new Date(event.event.date).toLocaleDateString('fr-FR', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) }}</small></div>
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
            events : [],
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

                this.events = res.data;

                if(this.events.length > 0){
                    this.eventPending = this.events.filter(event => event.status === "pending");
                    this.eventParticipate = this.events.filter(event => event.uid !== this.uid);
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

        EventModifier(id){
            // console.log(id);
            this.$router.push({name: 'Event', params: {id: id}});
        }

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




