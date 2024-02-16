

/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import { createI18n } from 'vue-i18n';
import trLocale from './locales/tr.json';

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'


const i18n = createI18n({
  legacy: false,
    locale: 'tr', // kullanmak istediğiniz dil
    messages: {
      tr: trLocale, // çevirilerinizi içeren dosya
      // diğer diller
    },
  });

const app = createApp(App)

registerPlugins(app)
app.use(i18n)
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
