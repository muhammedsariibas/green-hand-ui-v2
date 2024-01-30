<template>
  <v-card elevation="24" class="bg-blue-lighten-2 mx-0 shadow-lg" style="">
    <v-card-title style="font-size: x-large">{{ data.name }}</v-card-title>

    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col class="text-h2" cols="6"> {{ temprature }}&deg;C </v-col>

        <v-col cols="6" class="text-right">
          <v-icon icon="mdi-weather-partly-cloudy" size="88"></v-icon>
        </v-col>
      </v-row>
    </v-card-text>

    <div class="d-flex py-3 justify-space-between">
      <v-list-item density="compact" title="Hissedilen">
        <v-list-item-subtitle>{{ feelsLike }}&deg;C</v-list-item-subtitle>
      </v-list-item>

      <v-list-item density="compact" prepend-icon="mdi-water-percent">
        <v-list-item-subtitle>{{ humidity }}%</v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-divider></v-divider>
  </v-card>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "@vue/runtime-core";
const cityName = ref("");
const data = ref(<any>[]);
const temprature = ref(<number | null>null);
const humidity = ref(<number | null>null);
const feelsLike = ref(<number | null>null);
onMounted(async () => {
  const key = "def839a048d29a250c202a662731cb95";
  cityName.value = "istanbul";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&appid=${key}&units=metric`;
  const response = await fetch(url);
  data.value = await response.json();

  temprature.value = parseInt(data.value.main.temp);
  humidity.value = parseInt(data.value.main.humidity);
  feelsLike.value = parseInt(data.value.main.feels_like);
});
</script>