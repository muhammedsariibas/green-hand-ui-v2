import { defineStore } from 'pinia'
import router from "@/router";


export const useMenuStore = defineStore('menuStore', {
    state: () => ({
        menu: [
            {
                to: "/applications",
                title: "Başvurular",
                value: "applications",
            },
            {
                to: "/visit",
                title: "Ziyaret",
                value: "visit",
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
            },
            {
                to: "/users",
                title: "Kullanıcılar",
                value: "users",
            },
            {
                to: "/roles",
                title: "Roller",
                value: "roles",
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
