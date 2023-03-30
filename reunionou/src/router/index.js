import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from '@/components/HelloWorld.vue';
import NotFound from '@/components/NotFound.vue';
import HomePage from '@/components/Home.vue';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';
import CreateEvent from '@/components/CreateEvent.vue';
import Welcome from '@/components/Welcome.vue';

const routes = [
    { name: 'Welcome', path: '/', component: Welcome},

    { name: 'Home', path: '/home', component: HomePage },

    { name: 'HelloWorld', path: '/helloWorld', component: HelloWorld },

    { name: 'SignIn', path: '/signIn', component: SignIn },

    { name: 'SignUp', path: '/signUp', component: SignUp },

    { name: 'CreateEvent', path: '/createEvent', component: CreateEvent },


    // A mettre à la fin de toutes les routes
    { name : 'notFound', path: '/:pathMatch(.*)', component: NotFound}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;