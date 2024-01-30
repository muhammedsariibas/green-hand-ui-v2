<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import SnackbarComp from "./components/SnackbarComp.vue";
import { useSnackbarStore } from '../src/stores/snackbarStore'
const snackbarStore = useSnackbarStore()
const snackbar = snackbarStore.getSnackbar;
</script>

<template>
  <div>
    <component :is="$route.meta.layout">
      <RouterView /> 
    </component> 
    
    <SnackbarComp :text="snackbar.text"
    :color="snackbar.color" v-model="snackbar.isOpen" ></SnackbarComp>
  </div>
</template>

<style scoped>
</style>
