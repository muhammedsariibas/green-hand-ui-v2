import { defineStore } from 'pinia'
import router from "@/router";


export const useMenuStore = defineStore('menuStore', {
    state: () => ({
        menu: [
            {
                to: "/home",
                title: "Anasayfa",
                value: "home",
                icon : "mdi-home"
            },
            {
                to: "/applications",
                title: "Başvurular",
                value: "applications",
                icon : "mdi-list-box"
            },
            {
                to: "/application-category",
                title: "Başvuru Kategorileri",
                value: "application-category",
                icon : "mdi-shape-plus"
            },
            {
                to: "/visit",
                title: "Ziyaret",
                value: "visit",
                icon : "mdi-wallet-travel",
                items: [
                    {
                        to: "/visit/list",
                        title: "Ziyaret Listesi",
                        value: "visit-list",
                    }, {
                        to: "/visit/report",
                        title: "Ziyaret Rapor",
                        value: "visit-report",
                    }
                ]
            },
            {
                to: "/distribution",
                title: "Dağıtım",
                value: "distribution",
                icon:"mdi-map-marker-path"
            },
            {
                to: "/users",
                title: "Kullanıcılar",
                value: "users",
                icon : "mdi-account-group"
            },
            {
                to: "/roles",
                title: "Roller",
                value: "roles",
                icon : "mdi-account-key"
            },

        ]
    }),
    actions : {
        openWindow(target : any){
            console.log(target)
            router.push(`${target.key}`)
        }
    },
    getters: {
        getMenu: state => state.menu,
      },


})
