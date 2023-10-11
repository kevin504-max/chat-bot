import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'
import VueSweetalert2 from 'vue-sweetalert2'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'sweetalert2/dist/sweetalert2.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

const app = createApp(App)
const router = createRouter({
    history: createWebHistory(),
    routes: [
        // define all routes here....
    ],
})

app.config.productionTip = false

app.use(router)
app.use(VueSweetalert2)

axios.defaults.baseURL = 'http://localhost:3300/api'

app.mount('#app')
