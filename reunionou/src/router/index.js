import { createRouter, createWebHistory } from "vue-router";
import About from '@/components/About.vue';
import NotFound from '@/components/NotFound.vue';
import HomePage from '@/components/Home.vue';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';
import CreateEvent from '@/components/CreateEvent.vue';
import Profil from '@/components/Profil.vue';
import Event from '@/components/Event.vue';

const routes = [

    { name: 'Home', path: '/', component: HomePage },

    { name: 'About', path: '/About', component: About },

    { name: 'SignIn', path: '/signIn', component: SignIn },

    { name: 'SignUp', path: '/signUp', component: SignUp },

    { name: 'CreateEvent', path: '/createEvent', component: CreateEvent },

    { name: 'Profil', path: '/profil', component: Profil},

    { name: 'Event', path: '/event/:id', component: Event },

    // A mettre à la fin de toutes les routes
    { name : 'notFound', path: '/:pathMatch(.*)', component: NotFound}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;