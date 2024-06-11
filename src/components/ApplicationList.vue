<script lang="ts" setup>
import { ref } from "vue";
import CashAidApplicationList from './CashAidApplicationList.vue'
import OneTimeAidApplicationList from './OneTimeAidApplicationList.vue'
const tab = ref<any>(null);
</script>
<template>
  <v-col cols="12" sm="12" md="12" class="d-flex flex-wrap px-0 py-0">
  
    <v-col class="px-0 py-0">
      <v-tabs
      class="px-0"
      v-model="tab"
      density="compact"
      color="primary"
    >
      <v-tab   value="one">Nakdi</v-tab>
      <v-tab  value="two">Diğer</v-tab>
    </v-tabs>
    <v-window v-model="tab" class="px-0 py-0">
        <v-window-item value="one" class="px-0 py-0">
          <CashAidApplicationList></CashAidApplicationList>
        </v-window-item>

        <v-window-item value="two" class="px-0 py-0">
          <OneTimeAidApplicationList></OneTimeAidApplicationList>
        </v-window-item>

      
      </v-window>
    </v-col>
  </v-col>
</template>