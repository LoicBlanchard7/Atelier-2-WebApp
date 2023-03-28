import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from '@/components/HelloWorld.vue';
import NotFound from '@/components/NotFound.vue';

const routes = [
    { name: 'HelloWorld', path: '/', component: HelloWorld },

    // A mettre à la fin de toutes les routes
    { name : 'notFound', path: '/:pathMatch(.*)', component: NotFound}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;