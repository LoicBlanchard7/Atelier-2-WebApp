<template>
    <div class="container">
        <div>
            <p>Bienvenue sur Réunionnou, vous êtes connecté.</p>
            <p>Identifiant : {{ this.userUid }}</p>
        </div>
    </div>
</template>
<script>
//import axios from 'axios';
import "../../scss/custom.scss";
import { mapState } from 'vuex'

export default {
    name: 'HomePage',
    components: {},
    data() {
        return {
            userUid: "",
            userToken: "",
            userRefresh: "",
        }
    },
    computed: {
        ...mapState(['uid','token','refresh']),
    },
    methods: {
        connectAccount() {
            this.userUid = this.uid;
            this.userToken = this.token;
            this.userRefresh = this.refresh;
        }
    },
    created() {
        this.connectAccount();
    }
}
</script>

<style lang="scss" scoped>

</style>
