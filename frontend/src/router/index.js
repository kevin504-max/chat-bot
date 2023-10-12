import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/auth/AuthPage.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/auth/RegisterPage.vue'),
    },
    // {
    //     path: '/chat',
    //     name: 'chat',
    //     component: () => import('@/views/ChatPage.vue'),
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router