<template>
    <div class="home">

        <h1>Inscription</h1>

        <div>
            <p>Nom: </p>
            <input v-model="name" placeholder="nom" />
            <br>
            <p>Email: </p>
            <input v-model="email" placeholder="email" />
            <br>
            <p>Mot de passe: </p>
            <input type="password" v-model="password" placeholder="password" />
            <p v-if="password.length < 8">Le mot de passe doit contenir au moins 8 caractères</p>
            <p v-else>Le mot de passe est correct</p>
            <br>
            <button type="button" @click="addAccount()">S'inscrite</button><br/>
            <small>{{ this.message }}</small>
        </div>

    </div>
</template>
<script>
export default {
    name: 'SignUp',
    data(){
        return {
            name: '',
            email: '',
            password: '',
            message: ''
        };
    },
    methods:{
        addAccount(){
            if(this.name === '' || this.email === '' || this.password === '' || this.password.length < 8){
                this.message = 'Veuillez remplir tous les champs';
                return;
            }else{
                let account = {
                    name: this.name,
                    email: this.email,
                    password: this.password
                };
                console.log(account);
                this.resetForm();
            }   
        },
        resetForm(){
            this.name = '';
            this.email = '';
            this.password = '';
            this.message = '';
            this.numPassword = 0;
        }
    },
    components: {},
};
</script>