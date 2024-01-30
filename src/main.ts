

/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'



const app = createApp(App)

registerPlugins(app)

app.mount('#app')


// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import App from './App.vue'


// import router from './router'


// const app = createApp(App)
// app.use(vuetify)
// app.use(createPinia())
// app.use(router)
// app.use(SnackbarComp)
// app.mount('#app')
