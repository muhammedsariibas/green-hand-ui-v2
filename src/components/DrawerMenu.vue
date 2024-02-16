<template>
  <v-list nav >
    <template v-for="item in orderedMenu" :key="item.value">
      <template v-if="typeof item.items !== undefined && item.items != null">
        <v-list-group :value="item.value">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">{{ item.title }}</v-list-item>
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
        @click="menuStore.openWindow({ key: item.value })"
        :value="item.value"
        color="white"
      >
        {{ item.title }}
      </v-list-item>
    </template>
  </v-list>
</template>
  
  
  <script lang="ts" setup>
//IMPORT
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
</script>
  
<style scoped>
.v-list-item--active {
  background: transparent !important;
  color: rgb(0, 0, 0) !important;
}
</style>