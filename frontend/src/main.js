import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'sweetalert2/dist/sweetalert2.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

const app = createApp(App)

app.config.productionTip = false

app.use(router)
app.use(VueSweetalert2)

axios.defaults.baseURL = 'https://backbot-lrgy.onrender.com/api'

app.mount('#app')
