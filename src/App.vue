<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import SnackbarComp from "./components/SnackbarComp.vue";
import { useSnackbarStore } from "../src/stores/snackbarStore";
import { useTokenStore } from "./stores/tokenStore";
import LoginComp from "./components/LoginComp.vue";
import { computed, ref } from "vue";
const tokenStore = useTokenStore();
const snackbarStore = useSnackbarStore();
const snackbar = snackbarStore.getSnackbar;

const route = useRoute();
const path = computed(() => route.path);

let loginCompDialog = ref<any>(false);

function changeloginCompDialogValue(event: any) {
  loginCompDialog.value = event;
}
</script>

<template>
  <div>
    <component :is="$route.meta.layout">
      <RouterView />
    </component>
    <v-dialog :model-value="!tokenStore.getTokenExist">
      <login-comp
        :page-to-route="path"
        @login-dialog="changeloginCompDialogValue"
      />
    </v-dialog>
    <SnackbarComp
      :text="snackbar.text"
      :color="snackbar.color"
      v-model="snackbar.isOpen"
    ></SnackbarComp>
  </div>
</template>

<style scoped>
</style>
