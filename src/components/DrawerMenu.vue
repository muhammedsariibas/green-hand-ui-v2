<template>
  <v-list nav style="position: relative; min-height: 100vh">
    <template v-for="item in orderedMenu" :key="item.value">
      <template v-if="typeof item.items !== undefined && item.items != null">
        <v-list-group :value="item.value">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="item.icon">{{
              item.title
            }}</v-list-item>
          </template>

          <v-list-item
            v-for="subitem in item.items"
            :key="subitem.value"
            @click="menuStore.openWindow({ key: subitem.value })"
            :value="subitem.value"
            color="white"
          >
            {{ subitem.title }}
          </v-list-item>
        </v-list-group>
      </template>

      <v-list-item
        v-else
        :prepend-icon="item.icon"
        @click="menuStore.openWindow({ key: item.value })"
        :value="item.value"
        color="white"
      >
        {{ item.title }}
      </v-list-item>
    </template>

    <v-list-item
      style="
        position: absolute;
        bottom: 3px;
        width: 90%;
        background-color: rgb(84, 58, 183);
        color: white;
        font-family: 'Roboto', sans-serif;
        font-family: 'Roboto Condensed', sans-serif;
        font-family: 'Roboto Slab', serif;
      "
      @click="logout"
      link
      class="d-flex justify-center p"
    >
      ÇIKIŞ YAP
    </v-list-item>
  </v-list>
</template>
  
  
  <script lang="ts" setup>
//IMPORT
import router from "@/router";
import { useMenuStore } from "../stores/menuStore";
import { ref, computed } from "vue";

//DATA
const menuStore = useMenuStore();
const menu = menuStore.getMenu;

const orderedMenu = computed(() => {
  return menu.sort((a: any, b: any) => {
    return a.index - b.index;
  });
});

function logout(){
  router.push('/login')
}
</script>
  
<style scoped>
.v-list-item--active {
  background: transparent !important;
  color: rgb(0, 0, 0) !important;
}
</style>