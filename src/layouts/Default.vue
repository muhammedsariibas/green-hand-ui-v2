

<script setup lang="ts">
import { ref } from "vue";
import DrawerMenu from '@/components/DrawerMenu.vue'
import { useRoute } from "vue-router";

const currentRoute = useRoute();
let drawer = ref(false);
</script>
<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer v-model="drawer"  location="left" theme="light" temporary>
       <DrawerMenu />
      </v-navigation-drawer>

      <v-main class="pb-0">
        <v-col
          class="px-0 py-0"
          style="
            height: calc(100vh - 48px);
            background-color: rgb(245, 245, 249);
          "
        >
          <v-window class="px-3 py-3" style="height: 100%; ">
            <v-app-bar
              density="compact"
              flat
              style="background-color: rgb(84, 58, 183)"
            >
              <v-app-bar-nav-icon
                variant="text"
                @click.stop="drawer = !drawer"
                color="white"
              ></v-app-bar-nav-icon>
              <router-link
                to="/home"
                style="text-decoration: none; color: white"
              >
                <v-btn> {{ currentRoute.name }} </v-btn>
              </router-link>

              <v-spacer></v-spacer>

              <router-link
                to="/application"
                style="text-decoration: none; color: white"
              >
                <v-btn> Başvuru </v-btn>
              </router-link>
            </v-app-bar>

            <v-card elevation="2" style="overflow-y: auto;">
              <v-card-text class="px-0 py-0"  style="height:calc( 100vh - 80px);" >
                <slot />
              </v-card-text>
            </v-card>
          </v-window>
        </v-col>
      </v-main>
    </v-layout>
  </v-card>
</template>