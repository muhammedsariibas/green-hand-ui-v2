

<script setup lang="ts">
import { ref } from "vue";

let drawer = ref(true);
</script>
<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer v-model="drawer" location="left">
        <!-- <DrawerMenu /> -->
      </v-navigation-drawer>

      <v-main class="pb-0">
        <v-col
          class="px-0 py-0"
          style="
            height: calc(100vh - 48px);
            background-color: rgb(245, 245, 249);
          "
        >
          <v-window class="px-3 py-3" style="height: 100%; overflow-y: auto">
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

              <v-spacer></v-spacer>
             
                <router-link to="/login" style="text-decoration: none; color: white;">
                  <v-btn>
                  Başvuru
                </v-btn>
                </router-link>
           

            </v-app-bar>

            <v-card elevation="2">
              <v-card-text style="height: 100vh; overflow-y: auto">
                <slot />
              </v-card-text>
            </v-card>
          </v-window>
        </v-col>
      </v-main>
    </v-layout>
  </v-card>
</template>