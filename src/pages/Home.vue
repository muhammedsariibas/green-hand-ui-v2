<script lang="ts" setup>
import BarChart from '@/components/BarChart.vue';
import PieChart from '@/components/PieChart.vue';
import Weather from '@/components/Weather.vue';
import ApplicationReportByStreet from '@/components/ApplicationReportByStreet.vue'
</script>

<template>
  <v-col class="d-flex flex-wrap justify-start" >
  
    <v-col cols="12" sm="4" md="4">
      <v-card  class="mr-5 mb-10" elevation="12"
        ><BarChart 
      /></v-card>
    </v-col>
    <v-col cols="12" sm="5" md="5">
      <v-card  class="mr-5 mb-10" elevation="12"
        ><ApplicationReportByStreet 
      /></v-card>
    </v-col>
   
    <v-col
      
      style="height:100%; "
      class="d-flex flex-column justify-center "
      >
      <v-card class="bg-grey-lighten-4 " elevation="12"><PieChart/></v-card>
      <br>
      <br>
      <v-card class="bg-grey-lighten-4" elevation="12"><Weather/></v-card>
    </v-col>
   
  </v-col>
</template>