// Utilities
import router from '@/router';

import { createPinia } from 'pinia'
import { markRaw } from 'vue'
const pinia = createPinia()

pinia.use((context) => {
    var tkn:any = window.localStorage.getItem("token")
    if( tkn != null){
        context.store.$patch(JSON.parse(tkn))
    }
    //listen for changes and update localstorage
    context.store.$subscribe((mutation, state) => {
        if(mutation.storeId == "token" && state.token !=null)
            window.localStorage.setItem(mutation.storeId, JSON.stringify(state))
    })
})

pinia.use(({ store }) => {
    store.router = markRaw(router);
});

export default pinia