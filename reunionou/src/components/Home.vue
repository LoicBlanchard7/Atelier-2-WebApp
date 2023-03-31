<template>
      <NavBar/>

    <div class="container">
        <div v-if="!isConnected">
            <h3>Réunionou</h3>
            <p>Bienvenue sur Réunionnou, veuillez vous connecté.</p>
        </div>
        <div v-else>
            <p>Bienvenue sur Réunionnou, vous êtes connecté.</p>
            <p>Identifiant : {{ this.userUid }}</p>
        </div>
    </div>
    
    <Footer/>
</template>
<script>
import "../../scss/custom.scss";
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
export default {
    name: 'HomePage',
    components: {NavBar,Footer},
    data() {
        return {
            uid: "",
            token: "",
            refresh: "",
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
        
    },
    created() {
        let acc = JSON.parse(sessionStorage.getItem('account'));
        if(acc !== null){
            this.userUid = acc.uid;
            this.userToken = acc.access_token;
            this.userRefresh = acc.refresh_token;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
