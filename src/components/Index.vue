<template>
    <v-row class="h-100 w-100">
        <v-col class="h-100">
            <v-toolbar style="
            background: linear-gradient(
              60deg,
              rgba(84, 58, 183, 1) 0%,
              rgba(0, 172, 193, 1) 100%
            );
          ">
                <v-row>
                    <v-col class="d-flex justify-center">
                       <h1 style="display: inline-block;color:white">{{ device.name }}</h1>
                    </v-col>
                </v-row>
            </v-toolbar>

            <v-row class="button-container-wrapper">
                <v-col cols="0" md="3" xl="4">&nbsp;</v-col>
                <v-col class="d-flex justify-center align-center flex-column button-container pt-12" cols="12" md="6"
                    xl="4">
                    <v-btn block size="x-large" @click="openApplication">NAKDİ YARDIM BAŞVURUSU</v-btn>

                    <v-btn block v-for="(cat, ci) in categories" :key="ci" size="x-large"
                        @click="applyForOneTimeAid(cat)">{{ cat.name }} BAŞVURUSU</v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">

import { ref, computed, onMounted, watch, onBeforeMount, watchEffect } from "vue";
import router from "@/router";
import { fetchGet } from "../utils/fetchUtils";
import {useCookies} from '@vueuse/integrations/useCookies'
import { useRoute } from 'vue-router';

const currentRoute = useRoute();
const currentDevice = currentRoute.query.deviceId ?? null;
const device = ref<any>({ name: "" });

if (currentDevice != null) {
    setDeviceCookie();
}else{
    if(useCookies(["device"]).get("device")){
        device.value = useCookies(["device"]).get("device");
    }
}

async function setDeviceCookie() {
    try {
        const resp = await fetchGet(`/public/api/v1/mobile-device/${currentDevice}`);
        useCookies(["device"]).set("device", resp);
        device.value = resp;
    } catch (err) {
        console.error(err);
    }
}

function openApplication() {
    router.push("/application")
}

function applyForOneTimeAid(cat: any) {
    router.push(`/one-time-aid?category=${cat.id}`)
}


enum EntityStatus {
    ACTIVE,
    PASSIVE
}
type AidCategory = {
    id: number;
    creationDate: Date;
    name: string;
    status: EntityStatus;
}

const categories = ref<AidCategory[]>([]);

onMounted(async () => {
    try {
        const response = await fetchGet("/public/api/v1/aid/category");
        categories.value = response;
        console.log(categories);
    } catch (err) {
        console.error(err);
    }
})

const cssVars = computed(() => {
    return {
        "--row-count": categories.value.length - 1
    }
});

</script>

<style>
html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: linear-gradient(60deg,
            rgba(84, 58, 183, 1) 0%,
            rgba(0, 172, 193, 1) 100%);
}

#app {
    height: 100%;

}
</style>

<style scoped>
.grid {
    height: 100%;
    align-items: center;
    align-self: center;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(var(--row-count), 1fr);

    grid-column-gap: 30px;
    grid-row-gap: 30px;
}

.button-container button {
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.button-container-wrapper {
    height: calc(100% - 100px)
}
</style>