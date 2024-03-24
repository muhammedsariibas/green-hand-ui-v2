<script lang="ts" setup>
import { ref } from "vue";
import CashAidApplicationList from './CashAidApplicationList.vue'
import OneTimeAidApplicationList from './OneTimeAidApplicationList.vue'
const tab = ref<any>(null);
</script>
<template>
  <v-col cols="12" sm="12" md="12" class="d-flex flex-wrap px-0 py-0">
    <v-col cols="12" sm="12" md="12"
      ><h2
        style="
          font-family: 'Roboto', sans-serif;
          font-family: 'Roboto Condensed', sans-serif;
          font-family: 'Roboto Slab', serif;
        "
      >
        Başvurular
      </h2></v-col
    >
    <v-col>
      <v-tabs
      v-model="tab"
      bg-color="#543AB7"
    >
      <v-tab value="one">Nakdi</v-tab>
      <v-tab value="two">Tek seferlik</v-tab>
    </v-tabs>
    <v-window v-model="tab">
        <v-window-item value="one">
          <CashAidApplicationList></CashAidApplicationList>
        </v-window-item>

        <v-window-item value="two">
          <OneTimeAidApplicationList></OneTimeAidApplicationList>
        </v-window-item>

      
      </v-window>
    </v-col>
  </v-col>
</template>