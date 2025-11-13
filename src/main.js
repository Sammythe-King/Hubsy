import { createApp } from 'vue'
import App from './App.vue'
// import router from '../backend/routes'
// ✅ CORRECT
import router from './router' // This points to src/router/index.js

const app = createApp(App)

app.use(router)

app.mount('#app')
